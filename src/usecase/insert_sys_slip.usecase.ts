import { DBClientManager } from "../core/dbclient/dbclient.js";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app.js";


export interface Parameters {
  sys_slip_api: string,
  sys_slip_value: number,
  sys_slip_max: number,
  lastupdate: Date,
  created_at: Date,
  active: boolean
}

export interface Result {
  success: boolean,
  error?: ErrorInfo
}

export default async function insertSysSlip(params: Parameters): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount("sys_slip", { sys_slip_api: params.sys_slip_api })
    if (count > 0) {
      return {
        success: false,
        error: ErrorMap.DB_DUPLICATE_00321
      };
    } else {
      const result = await dbclient.insert("sys_slip", {
        sys_slip_api: params.sys_slip_api,
        sys_slip_value: params.sys_slip_value,
        sys_slip_max: params.sys_slip_max,
        lastupdate: params.lastupdate,
        created_at: params.created_at,
        active: params.active
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