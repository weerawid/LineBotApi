export interface LineWebhookEvent {
  type: 'message';
  message: LineMessage;
  webhookEventId: string;
  deliveryContext: {
    isRedelivery: boolean;
  };
  timestamp: number;
  source: LineSource;
  replyToken: string;
  mode: 'active' | 'standby';
}

export interface LineMessage {
  type: 'text';
  id: string; // ⚠️ แนะนำให้ใช้ string (แม้ตัวอย่างเป็น number)
  quoteToken?: string;
  markAsReadToken?: string;
  text: string;
}

export interface LineSource {
  type: 'user' | 'group' | 'room';
  userId?: string;
  groupId?: string;
  roomId?: string;
}
