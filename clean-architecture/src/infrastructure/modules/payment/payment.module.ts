import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from 'src/drivers/aplication/controllers/payment/payment.controller';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { PaymentUseCasesImpl } from 'src/core/application/use-cases/payment/payment.use-cases';
import { PaymentServiceImpl } from 'src/infrastructure/adapters/services/payment/payment.service';
import { OrderRepository } from 'src/infrastructure/adapters/persistence/repositories/order/order.repository';
import { OrderUseCasesImpl } from 'src/core/application/use-cases/orders/orders.use-cases';
import { ClientsModule } from '../clients/clients.module';
import { ProductModule } from '../products/product.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [AuthenticationModule, ClientsModule, ProductModule],
  controllers: [PaymentController],
  providers: [
    PrismaService,
    PaymentService,
    {
      provide: TOKENS.PAYMENT_REPOSITORY,
      useClass: PaymentServiceImpl,
    },
    {
      provide: TOKENS.PAYMENT_USE_CASES,
      useClass: PaymentUseCasesImpl,
    },
    {
      provide: TOKENS.ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
    {
      provide: TOKENS.ORDER_USE_CASES,
      useClass: OrderUseCasesImpl,
    },
  ],
  exports: [TOKENS.PAYMENT_USE_CASES, TOKENS.PAYMENT_REPOSITORY],
})
export class PaymentModule {}
