import { DBClientManager } from "../core/dbclient/dbclient.js";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app.js";
import { LineOrderItemModel } from "../model/line_order_item.model.js";


export interface Parameters {
  uuid: string
  qty: number
  price: number
  total: number
  createdAt: Date
  orderUuid: string
  menuUuid: string
}

export interface Result {
  success: boolean,
  data?: LineOrderItemModel,
  error?: ErrorInfo
}

export default async function insertLineOrderItem(params: Parameters): Promise<Result> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount('line_order_item', { line_order_item_uuid: params.uuid })
    if (count > 0) {
      return {
        success: false,
        error: ErrorMap.DB_DUPLICATE_00321
      };
    } else {
      const data = {
        line_order_item_uuid: params.uuid,
        line_order_item_qty: params.qty,
        line_order_item_price: params.price,
        line_order_item_total: params.total,
        line_order_item_created_at: params.createdAt,
        line_order_uuid: params.orderUuid,
        line_menu_uuid: params.menuUuid
      }
      const result = await dbclient.insert("line_order_item", data)
      return {
        success: result,
        data: {
          line_order_item_uuid: params.uuid,
          line_order_item_qty: params.qty,
          line_order_item_price: params.price,
          line_order_item_total: params.total,
          line_order_item_created_at: params.createdAt,
          line_order_uuid: params.orderUuid,
          line_menu_uuid: params.menuUuid
        }
      };
    }
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err)
    };
  }
}