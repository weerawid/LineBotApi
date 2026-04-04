import { DBClientManager } from "../core/dbclient/dbclient.js";
import { ErrorInfo, ErrorMap, getErrorMessage } from "../core/error/error.app.js";
import { LineMenuModel } from "../model/line_menu.model.js";


export interface Parameters {
  line_menu_uuid: string,
  data: {
    line_menu_price?: number | undefined | null,
  }
}

export interface Result {
  success: boolean,
  data?: LineMenuModel | null,
  error?: ErrorInfo
}

export default async function updateLineMenu(params: Parameters): Promise<Result> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const count = await dbclient.getRowsCount("line_menu", { line_menu_uuid: params.line_menu_uuid })
    if (count > 0) {
      const result = await dbclient.update("line_menu", {
        line_menu_price: params.data.line_menu_price,
      }, {
        line_menu_uuid: params.line_menu_uuid
      })
      return {
        success: result,
        data: await dbclient.selectOne<LineMenuModel>("line_menu", { line_menu_uuid: params.line_menu_uuid })
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