import { DBClientManager } from "../core/dbclient/dbclient";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app";
import { LineAddressModel } from "../model/line_address.model";


export interface Parameters {
  address_uuid: string,
  address_no: string,
  address_soi?: string | null
}

export interface Result {
  success: boolean,
  data?: LineAddressModel,
  error?: ErrorInfo
}

export default async function insertLineAddress(params: Parameters): Promise<Result | void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount("line_address", { line_address_no: params.address_no })
    if (count > 0) {
      return {
        success: false,
        error: ErrorMap.DB_DUPLICATE_00321
      };
    } else {
      const result = await dbclient.insert("line_address", {
        line_address_uuid: params.address_uuid,
        line_address_no: params.address_no,
        line_address_soi: params.address_soi
      })
      return {
        success: result,
        data: {
          line_address_uuid: params.address_uuid,
          line_address_no: params.address_no,
          line_address_soi: params.address_soi
        }
      };
    }
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err)
    };
  }
}