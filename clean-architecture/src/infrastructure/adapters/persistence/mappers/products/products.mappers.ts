import { Product } from 'src/core/domain/entities/products/product.entity';

export class ProductMapper {
  static mappedProductToDomain(
    data: Product & {
      category: {
        id: number;
        name: string;
        description?: string | null;
        created_at: Date;
        updated_at: Date;
      };
    },
  ): Product {
    return {
      id: data.id,
      name: data.name,
      description: data?.description ?? '',
      amount: data.amount,
      url_img: data.url_img,
      customizable: data.customizable,
      available: data.available,
      created_at: data.created_at,
      updated_at: data.updated_at,
      category: {
        id: data.category.id,
        name: data.category.name,
        created_at: data.category.created_at,
        updated_at: data.category.updated_at,
      },
    };
  }
}
