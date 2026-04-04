import type { Request, Response } from "express"
import { AppError, ErrorKey, getErrorMessage } from "../../core/error/error.app.js"
import { getParameter, hasParameter } from "../../core/utils/functional.js";
import { createOrder } from "../processor/line_order_processor.js";
import { getOrder } from "../../usecase/get_order.usecase.js";

export interface OrderItem{
  menu: string;
  qty: number;
  price: number;
  total: number;
}

export async function create(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { item, user_id, message_id } = req.body
    
    const itemList = hasParameter<OrderItem[]>(item, Array, ['menu', 'qty', 'price', 'total'])
    const userIdParam = hasParameter<string>(user_id, 'string')
    const messageIdParam = hasParameter<string>(message_id, 'string')

    const createResult = await createOrder(itemList, userIdParam, messageIdParam)

    res.status(201).json({line_order_uuid: createResult})
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}

export async function inquiry(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { message_id, user_id, order_uuid } = req.body

    const userIdParam = getParameter<string>(user_id, 'string')
    const messageIdParam = getParameter<string>(message_id, 'string')
    const orderUuidParam = getParameter<string>(order_uuid, 'string')

    if (!userIdParam && !messageIdParam && !orderUuidParam) {
      throw new AppError(ErrorKey.API_MISSING_PARAMETER_10001)
    }

    const orderResult = await getOrder({
      userId: userIdParam,
      messageId: messageIdParam,
      orderUuid: orderUuidParam
    })

    if (!orderResult.data) {
      throw new AppError(ErrorKey.DB_DATA_NOT_FOUND_00322)
    }

    res.status(200).json({success: true, data: orderResult.data})
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
} 