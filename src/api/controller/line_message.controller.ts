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

    const { id, text, type, action, quotedToken, quotedId, eventId } = req.body
    let isValidated = await validateUser(id)

    if (isValidated) {
      const result = await dbclient.insert("line_message", {
        line_message_id: id,
        line_message_text: text,
        line_message_type: type,
        line_message_action: action,
        line_message_quoted_token: quotedToken,
        line_message_quoted_id: quotedId,
        line_event_id: eventId
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