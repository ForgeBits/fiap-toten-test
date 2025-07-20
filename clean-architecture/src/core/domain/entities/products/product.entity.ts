import { CategoryEntity } from '../categories/category.entity';

export class Product {
  id: number;
  category: CategoryEntity;
  name: string;
  description?: string | null;
  amount: number;
  url_img: string;
  customizable: boolean;
  available: boolean;
  created_at: Date;
  updated_at: Date;
}
