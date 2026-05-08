export interface Orders {
  data: Order[];
}

export interface Order {
  id: number;
  items: OrderItem[];
  customerName: string;
  status: OrderStatus;
  totalPayment: number;
  date: string;
  userId: number;
}

export interface OrderItem {
  dishId: number;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Delivered';

export interface CheckoutPayload {
  items: OrderItem[];
  customerName: string;
}

export interface CheckoutResponse {
  orderId: number;
  status: string;
}
