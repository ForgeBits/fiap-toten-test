import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from '../../../drivers/aplication/controllers/products/product.controller';
import { PrismaService } from '../../config/database/prisma/prisma.service';
import { TOKENS } from '../../../core/application/constants/injection.tokens';
import { ProductsUseCasesImpl } from 'src/core/application/use-cases/products/products.use-case';
import { ProductsRepository } from '../../adapters/persistence/repositories/products/products.repository';
import { CategoryUseCasesImpl } from 'src/core/application/use-cases/categories/categories.use-case';
import { CategoriesRepository } from 'src/infrastructure/adapters/persistence/repositories/categories/categories.repository';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [ProductController],
  providers: [
    PrismaService,
    ProductService,
    {
      provide: TOKENS.PRODUCTS_USE_CASES,
      useClass: ProductsUseCasesImpl,
    },
    {
      provide: TOKENS.PRODUCTS_REPOSITORY,
      useClass: ProductsRepository,
    },
    {
      provide: TOKENS.CATEGORY_USE_CASES,
      useClass: CategoryUseCasesImpl,
    },
    {
      provide: TOKENS.CATEGORIES_REPOSITORY,
      useClass: CategoriesRepository,
    },
  ],
  exports: [TOKENS.PRODUCTS_USE_CASES, TOKENS.PRODUCTS_REPOSITORY],
})
export class ProductModule {}
