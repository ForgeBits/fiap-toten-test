export interface CategoryCreateInterface {
  name: string;
  description?: string | null;
}

export interface CategoriesInterface {
  id: number;
  name: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CategoriesResponseInterface {
  id: number;
  name: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}
