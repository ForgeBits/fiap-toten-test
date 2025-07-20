export interface RegisterItemInterface {
  name: string;
  description: string;
  amount: number;
  quantity: number;
}

export interface ProductItemsCreationInterface {
  id: number;
  essential: boolean;
  quantity: number;
  customizable: boolean;
}

export interface ProductsItemsInterface {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  description: string;
  amount: number;
  quantity: number;
  isActive: boolean;
}

export interface ProductsItemsResponseInterface {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  description: string;
  amount: number;
  quantity: number;
  isActive: boolean;
}
