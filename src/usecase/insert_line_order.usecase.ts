import { DBClientManager } from "../core/dbclient/dbclient.js";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app.js";
import { LineOrderModel } from "../model/line_order.model.js";

export interface Parameters {
  uuid: string
  total: number
  createdAt: Date
  messageId: string
  userId: string
}

export interface Result {
  success: boolean,
  data?: LineOrderModel,
  error?: ErrorInfo
}

export default async function insertLineOrder(params: Parameters): Promise<Result> {
  console.log('insertLineOrder params', params);
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount('line_order', { line_order_uuid: params.uuid })
    if (count > 0) {
      return {
        success: false,
        error: ErrorMap.DB_DUPLICATE_00321
      };
    } else {
      const data = {
        line_order_uuid: params.uuid,
        line_order_total: params.total,
        line_order_created_at: params.createdAt.toISOString(),
        line_message_id: params.messageId,
        line_user_id: params.userId
      }
      const result = await dbclient.insert("line_order", data)
      return {
        success: result,
        data: {
          line_order_uuid: params.uuid,
          line_order_total: params.total,
          line_order_created_at: params.createdAt,
          line_message_id: params.messageId,
          line_user_id: params.userId
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