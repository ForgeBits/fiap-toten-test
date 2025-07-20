import { Product } from '../../../../../domain/entities/products/product.entity';
import {
  ProductCreateInterface,
  ProductsQueryFiltersInterface,
} from '../../../../../domain/dtos/products/products.db.interface';
import { PaginatedResponse } from 'src/infrastructure/adapters/persistence/mappers/common/pagination.mappers';

export interface ProductsRepositoryInterface {
  create(category: ProductCreateInterface): Promise<Product>;
  findAll(
    filters: ProductsQueryFiltersInterface,
  ): Promise<PaginatedResponse<Product>>;
  findById(id: number): Promise<Product | null>;
  update(
    id: number,
    updated: Partial<ProductCreateInterface>,
  ): Promise<Product>;
  delete(id: number): Promise<void>;
  findByName(name: string): Promise<Product | null>;
  findProductsByIds(ids: number[]): Promise<Product[]>;
}
