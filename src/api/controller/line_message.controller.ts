import type { Request, Response } from "express"
import insertLineMessage from "../../usecase/insert_line_message.usecase.js"
import updateLineMessage from "../../usecase/update_line_message.usecase.js"
import { getErrorMessage } from "../../core/error/error.app.js";
import { getMessage } from "../../usecase/get_message.usecase.js";

type Params = {
  id: string;
};

export async function create(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id, text, type, action, quotedToken, quotedId, eventId } = req.body
    const result = await insertLineMessage({
      message_id: id,
      message_text: text,
      message_type: type,
      message_action: action,
      quoted_token: quotedToken,
      quoted_id: quotedId,
      event_id: eventId
    })
    res.status(201).json(result)
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}

export async function update(
  req: Request<Params>,
  res: Response
): Promise<void> {
  try {
    const messageId = req.params.id
    const { text, type, action, quotedToken, quotedId } = req.body
    const result = await updateLineMessage({
      message_id: messageId,
      data: {
        message_text: text,
        message_type: type,
        message_action: action,
        quoted_token: quotedToken,
        quoted_id: quotedId
      }
    })  
    res.status(201).json(result)
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}

export async function get(
  req: Request<Params>,
  res: Response
): Promise<void> {
  try {
    const messageId = req.params.id
    const result = await getMessage({
      filter: { line_message_id: messageId}  
    })  
    res.status(201).json(result)
  } catch (err: unknown) {
    res.status(500).json(getErrorMessage(err));
  }
}