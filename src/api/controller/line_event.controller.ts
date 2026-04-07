import type { Request, Response } from "express"  
import { DBClientManager } from "../../core/dbclient/dbclient.js"
import insertLineEvent from "../../usecase/insert_line_event.usecase.js"
import { getErrorMessage } from "../../core/error/error.app.js"
import { LineWebhookEvent } from "../../model/event.model.js"

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
    const { event, destination } = req.body
    const jsonEvent = JSON.parse(event) as LineWebhookEvent | null
    if (!jsonEvent) {
      res.status(400).json({ success: false, error: "Invalid event data" });
      return;
    }

    let eventId = jsonEvent.webhookEventId
    let groupId = jsonEvent.source.groupId ?? ''
    let timestamp = new Date(jsonEvent.timestamp)
    
    const result = await insertLineEvent({
      event_id: eventId,
      event: JSON.stringify(jsonEvent),
      group_id: groupId,
      timestamp: timestamp,
      destination: destination
    })
    res.status(201).json(result)
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}