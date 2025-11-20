import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ShoppingCart, Clock, Users } from "lucide-react";

async function getStats() {
  const [productsCount, ordersCount, customersCount, pendingOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  return {
    productsCount,
    ordersCount,
    customersCount,
    pendingOrders,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-2">Dashboard</h1>
        <p className="text-gray-400">Bienvenida al panel de administracion</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          href="/admin/products"
          className="card hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Productos</p>
              <p className="text-3xl font-bold">{stats.productsCount}</p>
            </div>
            <div className="text-pastel-rose opacity-20">
              <Package size={48} />
            </div>
          </div>
          <div className="mt-4 h-1 bg-pastel-rose rounded-full"></div>
        </Link>

        <Link
          href="/admin/orders"
          className="card hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pedidos Totales</p>
              <p className="text-3xl font-bold">{stats.ordersCount}</p>
            </div>
            <div className="text-pastel-lavender opacity-20">
              <ShoppingCart size={48} />
            </div>
          </div>
          <div className="mt-4 h-1 bg-pastel-lavender rounded-full"></div>
        </Link>

        <Link
          href="/admin/orders?status=pending"
          className="card hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pedidos Pendientes</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            </div>
            <div className="text-pastel-mint opacity-20">
              <Clock size={48} />
            </div>
          </div>
          <div className="mt-4 h-1 bg-pastel-mint rounded-full"></div>
        </Link>

        <Link
          href="/admin/customers"
          className="card hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Clientes</p>
              <p className="text-3xl font-bold">{stats.customersCount}</p>
            </div>
            <div className="text-pastel-peach opacity-20">
              <Users size={48} />
            </div>
          </div>
          <div className="mt-4 h-1 bg-pastel-peach rounded-full"></div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-serif mb-4">Acciones Rapidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/products/new" className="btn-primary text-center">
            Agregar Producto
          </Link>
          <Link href="/admin/orders" className="btn-secondary text-center">
            Ver Pedidos
          </Link>
          <Link href="/admin/categories" className="btn-outline text-center">
            Gestionar Categorias
          </Link>
        </div>
      </div>
    </div>
  );
}
