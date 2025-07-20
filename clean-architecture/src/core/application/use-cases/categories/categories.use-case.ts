import { Injectable, Inject } from '@nestjs/common';
import { AppError } from '../../../domain/errors/app.error';
import { handleServiceError } from '../../../../infrastructure/shared/utils/error.handler.util';
import { CategoryUseCases } from '../../ports/input/categories/categories.use-case.port';
import { CategoriesRepositoryInterface } from '../../ports/output/repositories/categories/categories.repository.interface';
import {
  CategoriesInterface,
  CategoryCreateInterface,
} from 'src/core/domain/dtos/categories/categories.db.interface';
import { TOKENS } from '../../constants/injection.tokens';

@Injectable()
export class CategoryUseCasesImpl implements CategoryUseCases {
  constructor(
    @Inject(TOKENS.CATEGORIES_REPOSITORY)
    private readonly repository: CategoriesRepositoryInterface,
  ) {}

  async findAll(): Promise<CategoriesInterface[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      handleServiceError(error, 'CategoryUseCases.findAll');
    }
  }

  async findById(id: number): Promise<CategoriesInterface> {
    try {
      const category = await this.repository.findById(id);
      if (!category) {
        throw AppError.notFound({
          message: 'Category not found',
        });
      }
      return category;
    } catch (error) {
      handleServiceError(error, 'CategoryUseCases.findById');
    }
  }

  async create(data: CategoryCreateInterface): Promise<CategoriesInterface> {
    try {
      const existingCategory = await this.repository.findByName(data.name);
      if (existingCategory) {
        throw AppError.conflict({
          message: 'A category with this name already exists',
        });
      }

      return await this.repository.create(data);
    } catch (error) {
      handleServiceError(error, 'CategoryUseCases.create');
    }
  }

  async update(
    id: number,
    data: Partial<CategoryCreateInterface>,
  ): Promise<CategoriesInterface> {
    try {
      const existingCategory = await this.repository.findById(id);
      if (!existingCategory) {
        throw AppError.notFound({
          message: 'Category not found',
        });
      }

      if (data.name) {
        const categoryWithSameName = await this.repository.findByName(
          data.name,
        );
        if (categoryWithSameName && categoryWithSameName.id !== id) {
          throw AppError.conflict({
            message: 'Another category with this name already exists',
          });
        }
      }

      return await this.repository.update(id, data);
    } catch (error) {
      handleServiceError(error, 'CategoryUseCases.update');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const existingCategory = await this.repository.findById(id);
      if (!existingCategory) {
        throw AppError.notFound({
          message: 'Category not found',
        });
      }

      await this.repository.delete(id);
    } catch (error) {
      handleServiceError(error, 'CategoryUseCases.delete');
    }
  }

  async findByName(name: string): Promise<CategoriesInterface> {
    try {
      const category = await this.repository.findByName(name);
      if (!category) {
        throw AppError.notFound({
          message: 'Category not found',
        });
      }
      return category;
    } catch (error) {
      handleServiceError(error, 'CategoryUseCases.findByName');
    }
  }
}
