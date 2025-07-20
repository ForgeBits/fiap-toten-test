import {
  CategoriesInterface,
  CategoryCreateInterface,
} from 'src/core/domain/dtos/categories/categories.db.interface';

export interface CategoryUseCases {
  findAll(): Promise<CategoriesInterface[]>;
  findById(id: number): Promise<CategoriesInterface>;
  create(data: CategoryCreateInterface): Promise<CategoriesInterface>;
  update(
    id: number,
    data: Partial<CategoryCreateInterface>,
  ): Promise<CategoriesInterface>;
  delete(id: number): Promise<void>;
  findByName(name: string): Promise<CategoriesInterface>;
}
