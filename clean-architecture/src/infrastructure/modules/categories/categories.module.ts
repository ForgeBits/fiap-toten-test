import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CategoryUseCasesImpl } from 'src/core/application/use-cases/categories/categories.use-case';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { CategoriesRepository } from 'src/infrastructure/adapters/persistence/repositories/categories/categories.repository';
import { CategoriesController } from 'src/drivers/aplication/controllers/categories/categories.controller';
import { TOKENS } from 'src/core/application/constants/injection.tokens';

@Module({
  imports: [AuthenticationModule],
  controllers: [CategoriesController],
  providers: [
    PrismaService,
    CategoriesService,
    {
      provide: TOKENS.CATEGORY_USE_CASES,
      useClass: CategoryUseCasesImpl,
    },
    {
      provide: TOKENS.CATEGORIES_REPOSITORY,
      useClass: CategoriesRepository,
    },
  ],
})
export class CategoriesModule {}
