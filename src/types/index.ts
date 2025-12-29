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
  discount_type: "fixed" | "percentage" | null;
  discount_value: number | string;
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
  discount_type?: "percentage" | "fixed" | null;
  discount_value?: number;
  discount_active?: boolean;
}

export type UpdateProductPayload = Omit<Product, "user_id">;

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  slug: string;
  image: string[];
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
}

export interface ShippingAddress {
  id: string;
  user_id: string;
  recipient_name: string;
  phone_number: string;
  address_line: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Type untuk membuat alamat baru (tanpa id dan timestamp)
export type CreateAddressInput = Omit<
  ShippingAddress,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "canceled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: {
    name: string;
    image: string[];
    slug: string;
  };
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItem[];
}
