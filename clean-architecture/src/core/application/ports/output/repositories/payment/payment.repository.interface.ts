import { OrdersInterface } from 'src/core/domain/dtos/orders/orders.db.interface';
import {
  CreatePaymentInterface,
  PaymentInterfaceResponse,
} from 'src/core/domain/dtos/payment/payment.db.interface';

export interface PaymentRepositoryInterface {
  createPayment(
    data: CreatePaymentInterface,
    order: OrdersInterface,
  ): Promise<PaymentInterfaceResponse>;
  getPaymentStatus(transactionId: string): Promise<PaymentInterfaceResponse>;
  cancelPayment(transactionId: string): Promise<void>;
}
