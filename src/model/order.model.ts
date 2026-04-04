export interface OrderModel {
  order_uuid: string;
  order_total: number;
  order_created_at: Date;
  message_id: string;
  user_id: string;
  order_item: OrderItemModel[];
}

export interface OrderItemModel {
  order_item_uuid: string;
  order_item_qty: number;
  order_item_price: number;
  order_item_total: number;
  order_item_created_at: Date;
  menu_name: string;
  menu_price: number;
}