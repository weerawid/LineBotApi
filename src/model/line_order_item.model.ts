export interface LineOrderItemModel {
  line_order_item_uuid: string;
  line_order_item_qty: number;
  line_order_item_price: number;
  line_order_item_total: number;
  line_order_item_created_at: Date;
  line_order_uuid: string;
  line_menu_uuid: string;
}