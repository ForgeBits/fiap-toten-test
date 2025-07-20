import { Module } from '@nestjs/common';
import { ProductItemsController } from 'src/drivers/aplication/controllers/product-items/product-items.controller';
import { ProductItemsService } from './product-items.service';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { ProductItemsUseCasesImpl } from 'src/core/application/use-cases/products-item/products-items.use-cases';
import { ProductItemsRepository } from 'src/infrastructure/adapters/persistence/repositories/products-item/product-items.repository';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [ProductItemsController],
  providers: [
    ProductItemsService,
    PrismaService,
    {
      provide: TOKENS.PRODUCT_ITEM_USE_CASES,
      useClass: ProductItemsUseCasesImpl,
    },
    {
      provide: TOKENS.PRODUCTS_ITEM_REPOSITORY,
      useClass: ProductItemsRepository,
    },
  ],
})
export class ProductItemsModule {}
