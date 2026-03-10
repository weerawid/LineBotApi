import type { Request, Response } from "express"
import { DBClientManager } from "../../core/dbclient/dbclient"
import { logErrorMessage } from "../../core/error/error.helper"
import { AppError, ErrorKey, ErrorMap, getErrorMessage } from "../../core/error/error.app"

export async function inquiry(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()

    const result = await dbclient.execute( "SELECT * FROM line_event le")

    res.json({
      data: result.rows,
    })
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}

export async function create(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()

    const { event, destination } = req.body
    const jsonEvent = JSON.parse(event)

    let eventId = jsonEvent.webhookEventId
    let groupId = jsonEvent.source.groupId
    let timestamp = new Date(jsonEvent.timestamp).toISOString()
    let isValidated = await validateEvent(eventId)

    if (isValidated) {
      const result = await dbclient.insert("line_event", {
        line_event_id: eventId,
        line_event_message: jsonEvent,
        line_group_id: groupId,
        line_event_timestamp: timestamp,
        line_event_destination: destination
      })
    } else {
      res.status(500).json(ErrorMap.DB_DUPLICATE_00321);
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

async function validateEvent(eventId: string) {
  try {
    const dbclient: DBClientManager = DBClientManager.getInstance()
    const result = await dbclient.execute("SELECT * FROM line_event le WHERE line_event_id = ?", [eventId])
   return result.rows.length == 0
  } catch (err: unknown) {
    throw new AppError(ErrorKey.DB_EXECUTEION_FAILURE_00301, `Event validation failed: ${err}` )
  }
}