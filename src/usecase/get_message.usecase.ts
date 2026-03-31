import { DBClientManager } from "../core/dbclient/dbclient";
import { AppError, ErrorInfo, ErrorKey, getErrorMessage } from "../core/error/error.app";
import { LineMessageModel } from "../model/line_mesage.model";
import { SysSlipModel } from "../model/sys_slip.model";

export interface Request {
  filter?: Record<string, any> | null
}

export interface Result {
  success: boolean,
  data?: LineMessageModel[] | null,
  error?: ErrorInfo
}

export async function getMessage(request: Request): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const result = await dbclient.selectAll<LineMessageModel>("line_message", request.filter)
    if (result) {
      return {
        success: true,
        data: result
      };
    } else {
      throw new AppError(ErrorKey.DB_DATA_NOT_FOUND_00322)
    }
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err)
    };
  }
}