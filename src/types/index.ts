export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  category: "body" | "lens" | "fullset" | "accessories";
  price: number;
  stock: number;
  image_urls: string[];
  description: string;
  status: "active" | "inactive";
  condition: "new" | "used";
  rating_avg: number;
  rating_count: number;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  discount_active: boolean;
  final_price: number;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  category: "body" | "lens" | "fullset" | "accessories";
  price: number;
  stock: number;
  image_urls?: string[];
  description?: string;
  status: "active" | "inactive";
  condition: "new" | "used";
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  discount_active?: boolean;
}
