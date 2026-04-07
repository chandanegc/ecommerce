/** Product as returned from the API */
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  img: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type productIR = Product;
