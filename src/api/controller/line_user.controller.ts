import type { Request, Response } from "express"
import insertLineUser from "../../usecase/insert_line_user.usecase"
import { getErrorMessage } from "../../core/error/error.app"
import updateLineUser from "../../usecase/update_line_user.usecase"

export async function create(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id, address, description } = req.body
    const result = await insertLineUser({
      user_id: id,
      user_address: address,
      user_description: description
    })
    res.status(201).json(result)
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}

export async function update(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.params.id as string
    const { address, desc } = req.body
    const result = await updateLineUser({
      line_user_id: userId,
      data: {
        line_user_address: address,
        line_user_desc: desc
      }
    })
    res.status(201).json(result)
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}