import { createClient } from "@/lib/supabase/client";
import { DashboardData, Order, Product } from "@/types";

export const getDashboardStats = async () => {
  const supabase = createClient();

  // Ambil data orders dan products secara paralel untuk efisiensi
  const [ordersRes, productsRes] = await Promise.all([
    supabase.from("orders").select("total_price, status"),
    supabase.from("products").select("stock, average_rating"),
  ]);

  const orders = ordersRes.data || [];
  const products = productsRes.data || [];

  // Hitung metrik
  const revenue = orders
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((acc, curr) => acc + (curr.total_price || 0), 0);

  const lowStockItems = products.filter((p) => p.stock < 5).length;

  const totalRating = products.reduce(
    (acc, curr) => acc + (Number(curr.average_rating) || 0),
    0
  );
  const avgRating =
    products.length > 0 ? (totalRating / products.length).toFixed(1) : "0";

  return {
    revenue,
    orderCount: orders.length,
    avgRating,
    lowStockItems,
  };
};

export const getDashboardData = async (): Promise<DashboardData> => {
  const supabase = createClient();

  const [statsRes, ordersRes, lowStockRes, topSellingRes] = await Promise.all([
    getDashboardStats(), // Pastikan return DashboardStats
    supabase
      .from("orders")
      .select(
        `
        *,
        shipping_addresses (*),
        user:users (*) 
      `
      )
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .lt("stock", 10)
      .order("stock", { ascending: true })
      .limit(5),
    supabase
      .from("products")
      .select("*, brands(*), categories(*)")
      .order("sold", { ascending: false })
      .limit(5),
  ]);

  // Handle Error jika perlu
  if (ordersRes.error) throw ordersRes.error;

  return {
    stats: statsRes,
    // Kita gunakan unknown as T karena Supabase join terkadang
    // dideteksi sebagai array oleh TS secara default
    recentOrders: ordersRes.data as unknown as Order[],
    lowStock: (lowStockRes.data || []) as Product[],
    topSelling: (topSellingRes.data || []) as Product[],
  };
};
