import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { OrderUseCasesImpl } from 'src/core/application/use-cases/orders/orders.use-cases';
import { OrderRepository } from 'src/infrastructure/adapters/persistence/repositories/order/order.repository';
import { OrdersController } from 'src/drivers/aplication/controllers/orders/orders.controller';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { ClientsModule } from '../clients/clients.module';
import { PaymentModule } from '../payment/payment.module';
import { ProductModule } from '../products/product.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [AuthenticationModule, ClientsModule, PaymentModule, ProductModule],
  controllers: [OrdersController],
  providers: [
    PrismaService,
    OrdersService,
    {
      provide: TOKENS.ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
    {
      provide: TOKENS.ORDER_USE_CASES,
      useClass: OrderUseCasesImpl,
    },
  ],
})
export class OrdersModule {}
