import { DBClientManager } from "../core/dbclient/dbclient";
import { AppError, ErrorInfo, ErrorKey, getErrorMessage } from "../core/error/error.app";
import { LineMenuModel } from "../model/line_menu.model";

export interface Request {
  filter?: Record<string, any> | null
}

export interface Result {
  success: boolean,
  data?: LineMenuModel[] | null,
  error?: ErrorInfo
}

export async function getLineMenu(request: Request): Promise<Result> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const result = await dbclient.selectAll<LineMenuModel>("line_menu", request.filter)
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