import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { PaymentUseCases } from 'src/core/application/ports/input/payment/payment.use-case.port';
import { PaymentEntity } from 'src/core/domain/entities/payment/payment.entity';
import { CreatePaymentDto } from 'src/drivers/aplication/dtos/payment/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(TOKENS.PAYMENT_USE_CASES)
    private readonly paymentUseCases: PaymentUseCases,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentEntity> {
    return await this.paymentUseCases.createPayment(createPaymentDto);
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentEntity> {
    return await this.paymentUseCases.getPaymentStatus(transactionId);
  }

  async cancelPayment(transactionId: string): Promise<void> {
    return await this.paymentUseCases.cancelPayment(transactionId);
  }
}
