export interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  imgUrl: string;
  description?: string;
  category?: string;
  stock: number;
  images?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}