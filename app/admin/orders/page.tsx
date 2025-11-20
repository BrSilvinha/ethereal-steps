import { prisma } from "@/lib/prisma";
import OrdersTable from "./OrdersTable";

interface AdminOrdersPageProps {
  searchParams: {
    page?: string;
    status?: string;
  };
}

const ITEMS_PER_PAGE = 10;

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const page = Number(searchParams.page) || 1;
  const status = searchParams.status;

  const where = status ? { status } : {};

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gradient mb-2">
          Gestion de Pedidos
        </h1>
        <p className="text-gray-400">
          Total: {totalCount} {totalCount === 1 ? "pedido" : "pedidos"}
        </p>
      </div>

      <OrdersTable
        orders={orders}
        currentPage={page}
        totalPages={totalPages}
        selectedStatus={status}
      />
    </div>
  );
}
