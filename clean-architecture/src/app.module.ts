import { Module } from '@nestjs/common';
import { BcryptService } from './infrastructure/adapters/services/cryptography/bcrypt-service.service';
import { PrismaService } from './infrastructure/config/database/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/config/environment/configuration';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './infrastructure/exceptions/global.exception.filter';
import { CategoriesModule } from './infrastructure/modules/categories/categories.module';
import { CollaboratorsModule } from './infrastructure/modules/collaborators/collaborators.module';
import { OrdersModule } from './infrastructure/modules/orders/orders.module';
import { ClientsModule } from './infrastructure/modules/clients/clients.module';
import { ProductItemsModule } from './infrastructure/modules/product-items/product-items.module';
import { ProductModule } from './infrastructure/modules/products/product.module';
import { PaymentModule } from './infrastructure/modules/payment/payment.module';
import {HealthController} from "./drivers/aplication/controllers/health/health.controller";

@Module({
  controllers: [
    HealthController,
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    OrdersModule,
    ClientsModule,
    CollaboratorsModule,
    CategoriesModule,
    ProductItemsModule,
    ProductModule,
    PaymentModule,
  ],
  providers: [
    PrismaService,
    BcryptService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
