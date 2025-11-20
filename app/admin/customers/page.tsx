import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserTable } from "./UserTable";

interface Props {
  searchParams: { page?: string; search?: string };
}

export default async function CustomersPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const ITEMS_PER_PAGE = 10;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif mb-2">Usuarios</h1>
          <p className="text-gray-400">Gestiona los usuarios del sistema</p>
        </div>
      </div>

      <div className="card mb-6">
        <form className="flex gap-4">
          <input
            type="text"
            name="search"
            placeholder="Buscar por nombre o email..."
            defaultValue={search}
            className="input flex-1"
          />
          <button type="submit" className="btn-primary">
            Buscar
          </button>
          {search && (
            <Link href="/admin/customers" className="btn-outline">
              Limpiar
            </Link>
          )}
        </form>
      </div>

      <div className="card">
        <UserTable users={users} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-pastel-lavender/10">
            <p className="text-sm text-gray-400">
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(page * ITEMS_PER_PAGE, totalCount)} de {totalCount}{" "}
              usuarios
            </p>
            <div className="flex gap-2">
              <Link
                href={`/admin/customers?page=${page - 1}${
                  search ? `&search=${search}` : ""
                }`}
                className={`btn-outline ${
                  page <= 1 ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                Anterior
              </Link>
              <span className="px-4 py-2 text-sm">
                Pagina {page} de {totalPages}
              </span>
              <Link
                href={`/admin/customers?page=${page + 1}${
                  search ? `&search=${search}` : ""
                }`}
                className={`btn-outline ${
                  page >= totalPages ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                Siguiente
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
