import { DBClientManager } from "../core/dbclient/dbclient";
import { ErrorInfo, getErrorMessage } from "../core/error/error.app";
import { SysSlipModel } from "../model/sys-slip.model";

export interface Parameters {
  messageId: string,
  data: {
    messageText?: string | undefined | null,
    messageType?: string | undefined | null,
    messageAction?: string | undefined| null,
    quotedToken?: string | undefined | null,
    quotedId?: string | undefined | null,
    eventId?: string | undefined | null
  }
}

export interface Result {
  success: boolean,
  data?: SysSlipModel[] | null,
  error?: ErrorInfo
}

export async function getSysSlip(filter?: Record<string, any> | null): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const result = await dbclient.selectAll<SysSlipModel>("sys_slip", filter)
    return {
      success: true,
      data: result.map(row => ({
        ...row,
        created_at: row.created_at ? new Date(row.created_at): null,
        lastupdate: row.lastupdate ? new Date(row.lastupdate): null
      })) as SysSlipModel[]
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err)
    };
  }
}