import { Injectable, Inject } from '@nestjs/common';
import { AppError } from '../../../domain/errors/app.error';
import { handleServiceError } from '../../../../infrastructure/shared/utils/error.handler.util';
import { TOKENS } from '../../constants/injection.tokens';
import { ProductsRepositoryInterface } from '../../ports/output/repositories/products/products.repository.interface';
import { ProductUseCases } from '../../ports/input/products/products.use-case.port';
import { Product } from '../../../domain/entities/products/product.entity';
import {
  ProductCreateInterface,
  ProductsQueryFiltersInterface,
} from '../../../domain/dtos/products/products.db.interface';
import { PaginatedResponse } from 'src/infrastructure/adapters/persistence/mappers/common/pagination.mappers';
import { CategoryUseCases } from '../../ports/input/categories/categories.use-case.port';

@Injectable()
export class ProductsUseCasesImpl implements ProductUseCases {
  constructor(
    @Inject(TOKENS.PRODUCTS_REPOSITORY)
    private readonly productRepository: ProductsRepositoryInterface,
    @Inject(TOKENS.CATEGORY_USE_CASES)
    private readonly categoryUseCases: CategoryUseCases,
  ) {}

  async create(data: ProductCreateInterface): Promise<Product> {
    try {
      const existingProduct = await this.productRepository.findByName(
        data.name,
      );

      if (existingProduct) {
        throw AppError.conflict({
          message: 'A product with this name already exists',
        });
      }

      const existingCategory = await this.categoryUseCases.findById(
        data.category,
      );

      if (!existingCategory) {
        throw AppError.notFound({
          message: 'Category not found',
        });
      }

      const product = await this.productRepository.create(data);

      console.log('Creating product with data:', data);

      return product;
    } catch (error) {
      handleServiceError(error, 'ProductUseCases.create');
    }
  }

  async findAll(
    filters: ProductsQueryFiltersInterface,
  ): Promise<PaginatedResponse<Product>> {
    try {
      return await this.productRepository.findAll(filters);
    } catch (error) {
      handleServiceError(error, 'ProductUseCases.findAll');
    }
  }

  async findById(id: number): Promise<Product> {
    try {
      const category = await this.productRepository.findById(id);
      if (!category) {
        throw AppError.notFound({
          message: 'Product not found',
        });
      }
      return category;
    } catch (error) {
      handleServiceError(error, 'ProductUseCases.findById');
    }
  }

  async update(
    id: number,
    data: Partial<ProductCreateInterface>,
  ): Promise<Product> {
    try {
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw AppError.notFound({
          message: 'Product not found',
        });
      }

      if (data.name) {
        const ProductWithSameName = await this.productRepository.findByName(
          data.name,
        );
        if (ProductWithSameName && ProductWithSameName.id !== id) {
          throw AppError.conflict({
            message: 'Another product with this name already exists',
          });
        }
      }

      return await this.productRepository.update(id, data);
    } catch (error) {
      handleServiceError(error, 'ProductUseCases.update');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const ProductWithSameName = await this.productRepository.findById(id);
      if (!ProductWithSameName) {
        throw AppError.notFound({
          message: 'Product not found',
        });
      }

      await this.productRepository.delete(id);
    } catch (error) {
      handleServiceError(error, 'ProductUseCases.delete');
    }
  }

  async findByName(name: string): Promise<Product> {
    try {
      const product = await this.productRepository.findByName(name);
      if (!product) {
        throw AppError.notFound({
          message: 'Product not found',
        });
      }
      return product;
    } catch (error) {
      handleServiceError(error, 'ProductUseCases.findByName');
    }
  }

  async findProductsByIds(ids: number[]): Promise<Product[]> {
    try {
      const products = await this.productRepository.findProductsByIds(ids);

      if (
        !ids?.every((id: number) =>
          products.some((product) => product.id === id),
        )
      ) {
        throw AppError.notFound({
          message: 'Product not found',
        });
      }

      return products;
    } catch (error) {
      handleServiceError(error, 'ProductUseCases.findProductsByIds');
    }
  }
}
