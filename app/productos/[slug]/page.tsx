import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" },
      },
      variants: {
        orderBy: { size: "asc" },
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <ProductDetailClient product={product} />
    </div>
  );
}
