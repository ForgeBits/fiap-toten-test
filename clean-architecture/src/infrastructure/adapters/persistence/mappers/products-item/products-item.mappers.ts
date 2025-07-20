import {
  ProductsItemsInterface,
  ProductsItemsResponseInterface,
} from 'src/core/domain/dtos/products-item/products-items.dto';

export class ProductsItemMapper {
  static mappedCollaboratorToDomain(
    data: ProductsItemsInterface,
  ): ProductsItemsResponseInterface {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      amount: data.amount,
      quantity: data.quantity,
      created_at: data.created_at,
      updated_at: data.updated_at,
      isActive: data.isActive,
    };
  }
}
