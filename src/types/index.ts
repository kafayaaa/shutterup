export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
  spec_keys?: SpecKey[];
}

export interface SpecKey {
  id: string;
  name: string;
  category_id: string;
  input_type: "text" | "number" | "select";
  options?: string[] | null;
}

export interface ProductSpec {
  id?: string;
  product_id?: string;
  spec_key_id: string;
  value: string;
  spec_keys?: {
    name: string;
  };
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  brand_id: string;
  brands?: Brand;
  width: number;
  height: number;
  length: number;
  weight: number;
  category_id: string;
  categories?: Category;
  specs: ProductSpec[];
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
  product_specs?: Record<string, string | number>;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  category: "body" | "lens" | "fullset" | "accessories";
  category_id: string;
  brand_id: string;
  price: number;
  stock: number;
  description: string;
  status: "active" | "inactive";
  condition: "new" | "used";
  image_urls: string[];
  weight: number;
  width: number;
  height: number;
  length: number;
  discount_type?: "percentage" | "fixed";
  discount_value: number;
  discount_active: boolean;
  product_specs?: Record<string, string | number>;
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
  user?: UserProfile;
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

// Tambahkan interface ini di file types Anda atau di atas service
export interface PostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

export interface DashboardStats {
  revenue: number;
  orderCount: number;
  avgRating: string | number;
  lowStockItems: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: Order[];
  lowStock: Product[];
  topSelling: Product[];
}
