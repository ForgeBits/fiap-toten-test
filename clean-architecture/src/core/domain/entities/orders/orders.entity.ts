export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
  IN_PREPARATION = 'IN_PREPARATION',
  READY_TO_DELIVER = 'READY_TO_DELIVER',
  DONE = 'DONE',
}

export interface OrderItemCustomerInterface {
  itemId: number;
  quantity: number;
  price: number;
  observation?: string | null;
}

export interface OrderItemInterface {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
  orderId?: number;
  observation?: string | null;
  customerItems?: OrderItemCustomerInterface[];
}

export class OrdersEntity {
  id: number;
  clientId?: number;
  status: OrderStatus;
  establishmentId?: number;
  amount: number;
  transactionId?: string | null;
  observation?: string | null;
  items: OrderItemInterface[];
  createdAt: Date;
  updatedAt: Date;
}
