import type { Request, Response } from "express"
import insertLineMessage from "../../usecase/insert-line-message.usecase"
import updateLineMessage from "../../usecase/update-line-message.usecase"
import { getErrorMessage } from "../../core/error/error.app";

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
    const userId = req.params.id
    const { text, type, action, quotedToken, quotedId } = req.body
    const result = await updateLineMessage({
      message_id: userId,
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