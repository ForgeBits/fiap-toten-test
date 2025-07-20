import {
  CategoriesInterface,
  CategoryCreateInterface,
} from 'src/core/domain/dtos/categories/categories.db.interface';

export interface CategoriesRepositoryInterface {
  create(category: CategoryCreateInterface): Promise<CategoriesInterface>;
  findAll(): Promise<CategoriesInterface[]>;
  findById(id: number): Promise<CategoriesInterface | null>;
  update(
    id: number,
    updated: Partial<CategoryCreateInterface>,
  ): Promise<CategoriesInterface>;
  delete(id: number): Promise<void>;
  findByName(name: string): Promise<CategoriesInterface | null>;
}
