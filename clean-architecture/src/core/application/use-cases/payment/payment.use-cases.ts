import { Inject, Injectable } from '@nestjs/common';
import { PaymentUseCases } from '../../ports/input/payment/payment.use-case.port';
import { PaymentRepositoryInterface } from '../../ports/output/repositories/payment/payment.repository.interface';
import { handleServiceError } from 'src/infrastructure/shared/utils/error.handler.util';
import {
  CreatePaymentInterface,
  PaymentInterfaceResponse,
} from 'src/core/domain/dtos/payment/payment.db.interface';
import { TOKENS } from '../../constants/injection.tokens';
import { OrderUseCases } from '../../ports/input/orders/orders.use-case.port';
import { AppError } from 'src/core/domain/errors/app.error';
import { OrderStatus } from 'src/core/domain/entities/orders/orders.entity';
import { OrdersInterface } from 'src/core/domain/dtos/orders/orders.db.interface';

@Injectable()
export class PaymentUseCasesImpl implements PaymentUseCases {
  constructor(
    @Inject(TOKENS.PAYMENT_REPOSITORY)
    private readonly repository: PaymentRepositoryInterface,
    @Inject(TOKENS.ORDER_REPOSITORY)
    private readonly orderUseCase: OrderUseCases,
  ) {}

  async createPayment(
    data: CreatePaymentInterface,
  ): Promise<PaymentInterfaceResponse> {
    try {
      if (!data.orderId) {
        throw AppError.badRequest({
          message: 'Order ID is required',
        });
      }
      const order = await this.orderUseCase.findById(data.orderId);

      if (!order) {
        throw AppError.notFound({
          message: 'Order not found',
        });
      }

      if (order.status !== OrderStatus.PENDING) {
        throw AppError.badRequest({
          message: 'Order is not in a valid state for payment',
        });
      }

      return await this.repository.createPayment(
        data,
        order as OrdersInterface,
      );
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.create');
    }
  }

  async getPaymentStatus(
    transactionId: string,
  ): Promise<PaymentInterfaceResponse> {
    try {
      return await this.repository.getPaymentStatus(transactionId);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.getPaymentStatus');
    }
  }

  async cancelPayment(transactionId: string): Promise<void> {
    try {
      return await this.repository.cancelPayment(transactionId);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.cancelPayment');
    }
  }
}
