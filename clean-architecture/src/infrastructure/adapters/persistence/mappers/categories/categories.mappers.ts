import {
  CategoriesInterface,
  CategoriesResponseInterface,
} from 'src/core/domain/dtos/categories/categories.db.interface';

export class CategoriesMapper {
  static mappedCategoryToDomain(
    data: CategoriesInterface,
  ): CategoriesResponseInterface {
    return {
      id: data.id,
      name: data.name,
      ...(!!data?.description && { description: data.description }),
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}
