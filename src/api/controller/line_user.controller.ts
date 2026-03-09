import type { Request, Response } from "express"
import { logErrorMessage } from "../../core/error/error.helper"
import { DBClientManager } from "../../core/dbclient/dbclient"
import { AppError, ErrorKey, ErrorMap, getErrorMessage } from "../../core/error/error.app"

export async function create(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()

    const { userId, userAddress, userDesc } = req.body
    let isValidated = await validateUser(userId)

    if (isValidated) {
      const result = await dbclient.insert("line_user", {
        line_user_id: userId,
        line_user_address: userAddress,
        line_user_desc: userDesc
      })
    } else {
      logErrorMessage(ErrorMap.DB_DUPLICATE_00321)
    }

    res.status(201).json({
      success: true,
      data: {
        status: "success"
      }
    })
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}

async function validateUser(userId: string) {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const result = await dbclient.execute("SELECT * FROM line_user le WHERE line_user_id = ?", [userId])
   return result.rows.length == 0
  } catch (err: unknown) {
    throw new AppError(ErrorKey.DB_EXECUTEION_FAILURE_00301, `User validation failed: ${err}` )
  }
}