import { v5 as uuidv5 } from 'uuid';

import UUIDNameSpace from '../../core/constraint/uuid_namespace.constraint.js';
import { getMenu } from './line_menu_processor.js';
import insertLineOrderItem from '../../usecase/insert_line_order_item.usecase.js';
import insertLineOrder from '../../usecase/insert_line_order.usecase.js';
import { AppError, ErrorKey } from '../../core/error/error.app.js';
import { getOrder } from '../../usecase/get_order.usecase.js';
import { OrderModel } from '../../model/order.model.js';
import { OrderItem } from '../controller/line_order.controller.js';

export async function createOrder(item: OrderItem[], userId: string, messageId: string): Promise<string | undefined> {
  const LINE_ORDER_UUID = uuidv5('line_order', UUIDNameSpace.BASE_UUID)
  const LINE_ORDER_ITEM_UUID = uuidv5('line_order_item', UUIDNameSpace.BASE_UUID)

  const orderDate = new Date()

  const orderUuid = uuidv5(`${userId}-${messageId}`, LINE_ORDER_UUID)
  var total = 0

  return Promise.all(item.map(async (orderItem, index) => {
    const menu = await getMenu(orderItem.menu, orderItem.price)
    if (!menu) return;
    const menuUuid = menu.line_menu_uuid
    const orderItemUuid = uuidv5(`${orderUuid}-${menuUuid}`, LINE_ORDER_ITEM_UUID)
    const orderItemResult = await insertLineOrderItem({
      uuid: orderItemUuid,
      qty: orderItem.qty,
      price: orderItem.price,
      total: orderItem.price * orderItem.qty,
      createdAt: orderDate,
      orderUuid: orderUuid,
      menuUuid: menuUuid
    })
    if (!orderItemResult.success) return;
    total += (orderItemResult.data?.line_order_item_total ?? 0) * orderItem.qty

    return orderItemUuid
  })).then(async () => {
    const orderResult = await insertLineOrder({
      uuid: orderUuid,
      total: total,
      createdAt: orderDate,
      messageId: messageId,
      userId: userId
    })
    return orderResult.data?.line_order_uuid;
  }).catch(() => {
    return undefined
  })
}


export async function inquiryOrder(userId?: string, messageId?: string, orderUuid?: string): Promise<OrderModel[] | undefined> {     
  try {
    if (!userId && !messageId && !orderUuid) {
      throw new AppError(ErrorKey.API_MISSING_PARAMETER_10001)
    } 
    const executeResult = await getOrder({
      userId: userId,
      messageId: messageId,
      orderUuid: orderUuid
    })

    if (!executeResult.success || !executeResult.data) {
      throw new AppError(ErrorKey.DB_DATA_NOT_FOUND_00322)
    }

    const orderData = executeResult.data
    return orderData
    
  } catch (error) {
    throw error
  }
}