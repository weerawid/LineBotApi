import { DBClientManager } from "../core/dbclient/dbclient";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app";
import { LineMenuModel } from "../model/line_menu.model";


export interface Parameters {
  uuid: string,
  name: string,
  price: number
}

export interface Result {
  success: boolean,
  data?: LineMenuModel,
  error?: ErrorInfo
}

export default async function insertLineMenu(params: Parameters): Promise<Result> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount("line_menu", { line_menu_name: params.name })
    if (count > 0) {
      return {
        success: false,
        error: ErrorMap.DB_DUPLICATE_00321
      };
    } else {
      const result = await dbclient.insert("line_menu", {
        line_menu_uuid: params.uuid,
        line_menu_name: params.name,
        line_menu_price: params.price
      })
      return {
        success: result,
        data: {
          line_menu_uuid: params.uuid,
          line_menu_name: params.name,
          line_menu_price: params.price
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