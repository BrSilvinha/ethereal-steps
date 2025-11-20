import { prisma } from "@/lib/prisma";
import CategoriesTable from "./CategoriesTable";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gradient mb-2">
          Gestion de Categorias
        </h1>
        <p className="text-gray-400">
          Total: {categories.length} {categories.length === 1 ? "categoria" : "categorias"}
        </p>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  );
}
