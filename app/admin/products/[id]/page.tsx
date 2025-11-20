import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        variants: {
          orderBy: { size: "asc" },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-pastel-lavender hover:text-pastel-rose transition-colors"
        >
          &larr; Volver a Productos
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gradient mb-8">
          Editar Producto
        </h1>

        <ProductForm
          categories={categories}
          product={{
            ...product,
            price: Number(product.price),
            comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          }}
        />
      </div>
    </div>
  );
}
