import { DBClientManager } from "../core/dbclient/dbclient.js";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app.js";


export interface Parameters {
  user_id: string,
  user_address: string,
  user_description: string
}

export interface Result {
  success: boolean,
  error?: ErrorInfo
}

export default async function insertLineUser(params: Parameters): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount("line_user", { line_user_id: params.user_id })
    if (count > 0) {
      return {
        success: true
      };
    } else {
      const result = await dbclient.insert("line_user", {
        line_user_id: params.user_id,
        line_user_address: params.user_address,
        line_user_desc: params.user_description
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