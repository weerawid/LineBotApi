import type { Request, Response } from "express"
import insertLineUser from "../../usecase/insert-line-user.usecase"
import { getErrorMessage } from "../../core/error/error.app"

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