/** Product as returned from the API */
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  img: string;
}

/** Cart item extends Product with a quantity field */
export interface CartItem extends Product {
  quantity: number;
}

// Keep legacy alias so existing code doesn't break during migration
export type productIR = Product;
