import type { Request, Response } from "express"
import { getDBClient } from "../../core/dbclient/dbclient"
import type { Client } from "@libsql/client"
import { ErrorMap } from "../../core/error/error.map"
import { logErrorMessage } from "../../core/error/error.helper"

export async function inquiry(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dbclient: Client = await getDBClient()

    const result = await dbclient.execute(
      "SELECT * FROM line_event le"
    )

    res.json({
      data: result.rows,
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error"

    res.status(500).json(ErrorMap.UNKNOW_ERROR_00000)
  }
}

export async function create(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dbclient: Client = await getDBClient()

    const { eventValue } = req.body
    const eventData = JSON.parse(eventValue)
    const destination = eventData.destination

    const listStatus = []
    for (const event of eventData.events) {
      let eventId = event.webhookEventId
      let groupId = event.source.groupId
      let timestamp = new Date(event.timestamp).toISOString()
      let isValidated = await validateEvent(eventId)

      if (isValidated) {
        const result = await dbclient.execute({
          sql: "INSERT INTO line_event(line_event_id, line_event_message, line_group_id, line_event_timestamp, line_event_destination) VALUES (?, ?, ?, ?, ?)",
          args: [eventId, eventValue, groupId, timestamp, destination],
        })  
      } else {
        
        logErrorMessage(ErrorMap.DB_DUPLICATE_00301)
      }

      listStatus.push({
        id: eventId,
        insertStatus: isValidated
      })
    }

    res.status(201).json({
      success: true,
      data: {
        eventStatus: listStatus
      }
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    res.status(500).json({
      code: "99999",
      message,
    })
  }
}

async function validateEvent(eventId: string) {
  try {
    const dbclient: Client = await getDBClient()
    const result = await dbclient.execute(
      "SELECT * FROM line_event le WHERE line_event_id = ?", [eventId]
    )
   return result.rows.length == 0
  } catch (err: unknown) {
    logErrorMessage(err)
    return false
  }
}