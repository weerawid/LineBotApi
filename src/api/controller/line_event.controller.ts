import type { Request, Response } from "express"
import { getDBClient } from "../../core/dbclient/dbclient"
import type { Client } from "@libsql/client"

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

    res.status(500).json({
      code: "99999",
      message,
    })
  }
}

export async function create(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dbclient: Client = await getDBClient()

    const { eventId, eventValue, groupId } = req.body

    const result = await dbclient.execute({
      sql: "INSERT INTO line_event(line_event_id, line_event_message, line_group_id) VALUES (?, ?, ?)",
      args: [eventId, eventValue, groupId],
    })

    res.status(201).json({
      success: true
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    res.status(500).json({
      code: "99999",
      message,
    })
  }
}
