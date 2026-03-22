export interface LineMessageModel {
  line_message_id: string | null;
  line_message_text: string | null;
  line_message_type: string | null;
  line_message_action: boolean;
  line_message_quoted_token: string | null;
  line_message_quoted_id: string | null;
  line_event_id: string | null;
}