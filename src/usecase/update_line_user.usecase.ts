import { DBClientManager } from "../core/dbclient/dbclient.js";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app.js";


export interface Parameters {
  line_user_id: string,
  data: {
    line_user_address?: string | undefined | null,
    line_user_desc?: string | undefined | null
  }
}

export interface Result {
  success: boolean,
  error?: ErrorInfo
}

export default async function updateLineUser(params: Parameters): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount("line_user", { line_user_id: params.line_user_id })
    if (count > 0) {
      const result = await dbclient.update("line_user", {
        line_user_address: params.data.line_user_address,
        line_user_desc: params.data.line_user_desc,
      }, {
        line_user_id: params.line_user_id
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