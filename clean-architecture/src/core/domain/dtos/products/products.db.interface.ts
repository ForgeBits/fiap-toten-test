import { PaginationQueryDbInterface } from '../common/pagination.query.db.interface';

export interface ProductCreateInterface {
  name: string;
  category: number;
  description?: string | null;
  amount: number;
  url_img: string;
  customizable: boolean;
  available: boolean;
  productItems: ProductItemDto[];
}

class ProductItemDto {
  id: number;
  essential: boolean;
  quantity: number;
  customizable: boolean;
}

export interface ProductsQueryFiltersInterface
  extends PaginationQueryDbInterface {
  id?: number;
  categoryId?: number;
  name?: string;
}
