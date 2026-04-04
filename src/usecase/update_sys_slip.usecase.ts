import { DBClientManager } from "../core/dbclient/dbclient.js";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app.js";


export interface Parameters {
  sys_slip_api: string,
  data: {
    sys_slip_value?: number | undefined | null,
    sys_slip_max?: string | undefined | null,
    lastupdate?: Date | undefined| null,
    created_at?: Date | undefined | null
  }
}

export interface Result {
  success: boolean,
  error?: ErrorInfo
}

export default async function updateSysSlip(params: Parameters): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount("sys_slip", { sys_slip_api: params.sys_slip_api })
    if (count > 0) {
      const result = await dbclient.update("sys_slip", {
        sys_slip_value: params.data.sys_slip_value,
        sys_slip_max: params.data.sys_slip_max,
        lastupdate: params.data.lastupdate,
        created_at: params.data.created_at
      }, {
        sys_slip_api: params.sys_slip_api
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