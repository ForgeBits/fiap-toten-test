import { OrderStatus } from '../../entities/orders/orders.entity';
import { PaginationQueryDbInterface } from '../common/pagination.query.db.interface';
import { ClientEntity } from '../../entities/clients/clients.entity';
import { PaymentInterfaceResponse } from '../payment/payment.db.interface';

interface OrderItemCustomerInterface {
  itemId: number;
  quantity: number;
  price: any;
  title: string;
  description?: string;
  photo?: string;
  unitPrice?: number;
  productId?: number;
  observation?: string;
}

export interface OrderItemInterface {
  id?: number;
  productId: number;
  title: string;
  description?: string | null;
  photo?: string | null;
  unitPrice?: number;
  quantity: number;
  price: any;
  orderId?: number;
  observation?: string | null;
  customerItems: OrderItemCustomerInterface[];
}

export interface OrderCreateInterface {
  clientId?: number;
  status: OrderStatus;
  establishmentId?: number;
  isRandomClient?: boolean;
  codeClientRandom?: number;
  amount: any;
  transactionId: string;
  items: OrderItemInterface[];
}

export interface OrderUpdateInterface extends Partial<OrderCreateInterface> {
  status: OrderStatus;
}

export interface OrdersInterface {
  id: number;
  clientId?: number | null;
  isRandomClient?: boolean;
  codeClientRandom?: number | null;
  status: OrderStatus;
  establishmentId?: number;
  amount: any;
  transactionId?: string | null;
  observation?: string | null;
  items: OrderItemInterface[];
  client?: ClientEntity | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderResponseInterface {
  id: number;
  amount: any;
  isRandomClient?: boolean;
  codeClientRandom?: number | null;
  transactionId?: string | null;
  status: OrderStatus;
  observation?: string | null;
  items: OrderItemInterface[];
  payment?: PaymentInterfaceResponse | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateOrderStatusInterface {
  status: OrderStatus;
}

export interface OrdersQueryFiltersInterface
  extends PaginationQueryDbInterface {
  id?: number;
  status?: OrderStatus;
}
