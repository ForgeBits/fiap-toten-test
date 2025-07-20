import { Product } from '../../../../domain/entities/products/product.entity';
import {
  ProductCreateInterface,
  ProductsQueryFiltersInterface,
} from '../../../../domain/dtos/products/products.db.interface';
import { PaginatedResult } from 'src/core/domain/dtos/common/pagination.query.db.interface';

export interface ProductUseCases {
  findAll(
    filters: ProductsQueryFiltersInterface,
  ): Promise<PaginatedResult<Product>>;
  findById(id: number): Promise<Product>;
  findProductsByIds(ids: number[]): Promise<Product[]>;
  create(data: ProductCreateInterface): Promise<Product>;
  update(id: number, data: Partial<ProductCreateInterface>): Promise<Product>;
  delete(id: number): Promise<void>;
  findByName(name: string): Promise<Product>;
}
