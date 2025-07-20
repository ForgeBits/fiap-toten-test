import {
  ProductsItemsResponseInterface,
  RegisterItemInterface,
} from 'src/core/domain/dtos/products-item/products-items.dto';
import { UpdateProductItemDto } from 'src/drivers/aplication/dtos/product-items/update-product-item.dto';

export interface ProductsItemRepositoryInterface {
  registerItem(
    data: RegisterItemInterface,
  ): Promise<ProductsItemsResponseInterface>;
  getAllItems(): Promise<ProductsItemsResponseInterface[]>;
  updateItem(
    id: number,
    data: UpdateProductItemDto,
  ): Promise<ProductsItemsResponseInterface>;
  deleteItem(id: number): Promise<ProductsItemsResponseInterface>;
}
