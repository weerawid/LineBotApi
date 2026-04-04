import { DBClientManager } from "../core/dbclient/dbclient.js";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app.js";


export interface Parameters {
  message_id: string,
  message_text: string,
  message_type: string,
  message_action: string,
  quoted_token?: string | undefined | null,
  quoted_id?: string | undefined | null,
  event_id: string
}

export interface Result {
  success: boolean,
  error?: ErrorInfo
}

export default async function insertLineMessage(params: Parameters): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount("line_message", { line_message_id: params.message_id })
    if (count > 0) {
      return {
        success: false,
        error: ErrorMap.DB_DUPLICATE_00321
      };
    } else {
      const result = await dbclient.insert("line_message", {
        line_message_id: params.message_id,
        line_message_text: params.message_text,
        line_message_type: params.message_type,
        line_message_action: params.message_action,
        line_message_quoted_token: params.quoted_token,
        line_message_quoted_id: params.quoted_id,
        line_event_id: params.event_id
      })
      return {
        success: result
      };
    }
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err)
    };
  }
}