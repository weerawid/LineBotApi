import { DBClientManager } from "../core/dbclient/dbclient";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app";


export interface Parameters {
  message_id: string,
  data: {
    message_text?: string | undefined | null,
    message_type?: string | undefined | null,
    message_action?: string | undefined| null,
    quoted_token?: string | undefined | null,
    quoted_id?: string | undefined | null,
    event_id?: string | undefined | null
  }
}

export interface Result {
  success: boolean,
  error?: ErrorInfo
}

export default async function updateLineMessage(params: Parameters): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount("line_message", { line_message_id: params.message_id })
    if (count > 0) {
      const result = await dbclient.update("line_message", {
        line_message_text: params.data.message_text,
        line_message_type: params.data.message_type,
        line_message_action: params.data.message_action,
        line_message_quoted_token: params.data.quoted_token,
        line_message_quoted_id: params.data.quoted_id,
        line_event_id: params.data.event_id
      }, {
        line_message_id: params.message_id
      })
      return {
        success: result
      };
    } else {
      return {
        success: false,
        error: ErrorMap.DB_DATA_NOT_FOUND_00322
      };
    }
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err)
    };
  }
}