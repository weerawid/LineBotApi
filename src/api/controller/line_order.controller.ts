import type { Request, Response } from "express"
import insertLineEvent from "../../usecase/insert_line_event.usecase"
import { getErrorMessage } from "../../core/error/error.app"


// export async function create(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   try {
//     const { item, address } = req.body
//     const jsonEvent = JSON.parse(event)

//     let eventId = jsonEvent.webhookEventId
//     let groupId = jsonEvent.source.groupId
//     let timestamp = new Date(jsonEvent.timestamp).toISOString()
    
//     const result = await insertLineEvent({
//       event_id: eventId,
//       event: event,
//       group_id: groupId,
//       timestamp: timestamp,
//       destination: destination
//     })
//     res.status(201).json(result)
//   } catch (err: unknown) {
//     res.status(500).json(getErrorMessage(err));
//   }
// }