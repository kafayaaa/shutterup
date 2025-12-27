import { getProductBySlug } from "@/services/product.service";
import { notFound } from "next/navigation";
import DetailProduct from "./DetailProduct";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <DetailProduct product={product} />;
}
