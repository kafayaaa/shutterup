export interface Product {
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  image_url?: string;
  description?: string;
  status: string;
  condition: string;
}
