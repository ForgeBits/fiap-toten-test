import {
  CreatePaymentInterface,
  PaymentInterfaceResponse,
} from 'src/core/domain/dtos/payment/payment.db.interface';

export interface PaymentUseCases {
  createPayment(
    data: CreatePaymentInterface,
  ): Promise<PaymentInterfaceResponse>;
  getPaymentStatus(transactionId: string): Promise<PaymentInterfaceResponse>;
  cancelPayment(transactionId: string): Promise<void>;
}
