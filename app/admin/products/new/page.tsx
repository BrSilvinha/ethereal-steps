import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import Link from "next/link";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

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
          Nuevo Producto
        </h1>

        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
