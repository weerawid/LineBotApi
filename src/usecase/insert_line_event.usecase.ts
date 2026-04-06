import { DBClientManager } from "../core/dbclient/dbclient.js";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app.js";


export interface Parameters {
  event_id: string,
  event: string,
  group_id: string,
  timestamp: Date,
  destination: string
}

export interface Result {
  success: boolean,
  error?: ErrorInfo
}

export default async function insertLineEvent(params: Parameters): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount("line_event", { line_event_id: params.event_id })
    if (count > 0) {
      return {
        success: false,
        error: ErrorMap.DB_DUPLICATE_00321
      };
    } else {
      const result = await dbclient.insert("line_event", {
        line_event_id: params.event_id,
        line_event_message: params.event,
        line_group_id: params.group_id,
        line_event_timestamp: params.timestamp,
        line_event_destination: params.destination
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