import { DBClientManager } from "../core/dbclient/dbclient.js";
import { AppError, ErrorKey, getErrorMessage } from "../core/error/error.app.js";
import { OrderModel, OrderItemModel } from "../model/order.model.js";

export interface Request {
  userId?: string | undefined;
  messageId?: string | undefined;
  orderUuid?: string | undefined;
} 

export interface Response {
  success: boolean;
  data?: OrderModel[] | null;
  error?: string;
}

export async function getOrder(request: Request): Promise<Response> {
  try {
    if (!request.userId && !request.messageId && !request.orderUuid) {
      throw new AppError(ErrorKey.API_MISSING_PARAMETER_10001)
    }

     const dbclient: DBClientManager = DBClientManager.getInstance()

    let sql = `SELECT * FROM line_order lo INNER JOIN line_order_item loi ON lo.line_order_uuid = loi.line_order_uuid INNER JOIN line_menu lm ON lm.line_menu_uuid = loi.line_menu_uuid` 
    if (request.orderUuid) {
      sql += ` WHERE lo.line_order_uuid = '${request.orderUuid}'`
    } else if (request.messageId) {
      sql += ` WHERE lo.line_message_id = '${request.messageId}'`
    } else if (request.userId) {
      sql += ` WHERE lo.line_user_id = '${request.userId}'`
    }

    const result = await dbclient.getSQLData(sql!)
    const groupedResults = { ...Object.groupBy(result, (item) => item.line_order_uuid) }
    const keysGroupedResults = Object.keys(groupedResults)

    let orders: OrderModel[] = []
  
    for (const key of keysGroupedResults) {
      const order = groupedResults[key]
      if (!order) continue
      const orderItems: OrderItemModel[] = order.map((item) => {
        return {  
          order_item_uuid: item.line_order_item_uuid,
          order_item_qty: item.line_order_item_qty,
          order_item_price: item.line_order_item_price,
          order_item_total: item.line_order_item_total,
          order_item_created_at: item.line_order_item_created_at,
          menu_name: item.line_menu_name,
          menu_price: item.line_menu_price
        } as OrderItemModel
      })

      orders.push({
        order_uuid: key,
        order_total: order[0].line_order_total,
        order_created_at: order[0].line_order_created_at,
        message_id: order[0].line_message_id,
        user_id: order[0].line_user_id,
        order_item: orderItems
      })
    } 

    return {
      success: true,
      data: orders
    }
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    }
  }
}