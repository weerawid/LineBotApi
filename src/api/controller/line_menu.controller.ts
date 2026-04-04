import type { Request, Response } from "express"
import { AppError, ErrorKey, getErrorMessage } from "../../core/error/error.app.js"
import { getMenu } from "../processor/line_menu_processor.js"
import { hasParameter } from "../../core/utils/functional.js"

export async function create(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, price } = req.body

    const menuNameValid = hasParameter<string>(name, 'string')
    const priceValid = hasParameter<number>(price, 'number')

    const menu = await getMenu(menuNameValid, priceValid)
    if (menu) {
      res.status(200).json({
        success: true,
        data: menu
      })
    } else {
      throw new AppError(ErrorKey.DB_DATA_NOT_FOUND_00322)
    }
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}