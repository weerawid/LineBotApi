import { DBClientManager } from "../core/dbclient/dbclient";
import { AppError, ErrorInfo, ErrorKey, getErrorMessage } from "../core/error/error.app";
import { SysSlipModel } from "../model/sys-slip.model";

export interface Request {
  filter?: Record<string, any> | null
}

export interface Result {
  success: boolean,
  data?: SysSlipModel[] | null,
  error?: ErrorInfo
}

export async function getSysSlip(request: Request): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const result = await dbclient.selectAll<SysSlipModel>("sys_slip", request.filter)
    if (result) {
      return {
        success: true,
        data: result.map(row => ({
          ...row,
          created_at: row.created_at ? new Date(row.created_at): null,
          lastupdate: row.lastupdate ? new Date(row.lastupdate): null
        })) as SysSlipModel[]
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