export interface Production<C> {
  id: number;
  name: string;
  price: number;
  stock: number;
  lockedStock: number;
  productionType: string;
  infinityStock: boolean;
  description: string;
  content: C;
  labels: string[]
}

export interface CartItem<C> {
  production: Production<C>;
  amount: number
}

export interface Cart {
  items: CartItem<unknown>[];
}

export interface ProductionStockChange {
  id: number;
  stock: number;
  lockedStock: number;
}