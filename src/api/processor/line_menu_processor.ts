import { v5 as uuidv5 } from 'uuid';

import { LineMenuModel } from "../../model/line_menu.model.js";
import { getLineMenu } from "../../usecase/get_menu.usecase.js";
import UUIDNameSpace from '../../core/constraint/uuid_namespace.constraint.js';
import insertLineMenu from '../../usecase/insert_line_menu.usecase.js';
import updateLineMenu from '../../usecase/update_line_menu.usecase.js';

export async function getMenu(name: string, price: number): Promise<LineMenuModel | undefined> {
  const LINE_MENU_UUID = uuidv5('line_menu', UUIDNameSpace.BASE_UUID)
  
  const getMenuResult = await getLineMenu({ filter: { line_menu_name: name } })
  const getMenuData = getMenuResult.data as LineMenuModel[] 
  if (getMenuData.length > 0) {
    const menu = getMenuData[0]
    if (menu.line_menu_price !== price) {
      const updateMenuResult = await updateLineMenu({
        line_menu_uuid: menu.line_menu_uuid,
        data: {
          line_menu_price: price
        }
      })
      if (updateMenuResult.success) {
        return updateMenuResult.data as LineMenuModel
      } else {
        return undefined
      }
    } 
    return 
  } else {
    const uuid = uuidv5(name, LINE_MENU_UUID)
    const insertMenuResult = await insertLineMenu({
      uuid: uuid,
      name: name,
      price: price
    })

    if (insertMenuResult.success) {
      return insertMenuResult.data as LineMenuModel
    } else {
      return undefined
    } 
  }
}