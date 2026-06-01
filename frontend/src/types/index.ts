export interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  imgUrl: string;
  description?: string;
  category?: 'vinyl' | 'cd' | 'merch';
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}