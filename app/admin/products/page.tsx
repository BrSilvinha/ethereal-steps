import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductsTable from "./ProductsTable";

interface AdminProductsPageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

const ITEMS_PER_PAGE = 10;

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
          take: 1,
        },
        variants: {
          select: { stock: true },
        },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gradient mb-2">
            Gestion de Productos
          </h1>
          <p className="text-gray-400">
            Total: {totalCount} {totalCount === 1 ? "producto" : "productos"}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + Nuevo Producto
        </Link>
      </div>

      <ProductsTable
        products={products}
        currentPage={page}
        totalPages={totalPages}
        searchQuery={search}
      />
    </div>
  );
}
