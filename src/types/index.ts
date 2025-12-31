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
  sold: number;
  average_rating: number;
  review_count: number;
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
    image_urls: string[];
    slug: string;
  };
}

export interface Order {
  id: string;
  user_id: string;
  address_id: string;
  total_price: number;
  status: OrderStatus;
  cancel_reason?: string | null;
  created_at: string;
  order_items?: OrderItem[];
  shipping_addresses?: {
    recipient_name: string;
    phone_number: string;
    address_line: string;
    city: string;
    province: string;
    postal_code: string;
  };
  has_review?: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id?: string;
  rating: number;
  comment: string;
  images: string[];
  is_anonymous: boolean;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
  users?: {
    full_name: string;
    avatar_url: string;
  };
  products?: {
    name: string;
  };
}
