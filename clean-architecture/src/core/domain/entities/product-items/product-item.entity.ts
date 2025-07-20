import { Product } from '../products/product.entity';
import { Item } from '../items/items.entity';

export class ProductItem {
  id: number;
  product: Product;
  item: Item;
  essential: boolean;
  quantity: number;
  customizable: boolean;
  created_at: Date;
  updated_at: Date;
}
