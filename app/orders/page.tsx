import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default async function OrdersPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const statusConfig = {
    PENDING: { label: "Pendiente de Pago", color: "text-yellow-400", bg: "bg-yellow-400/20" },
    PAID: { label: "Pagado", color: "text-green-400", bg: "bg-green-400/20" },
    PROCESSING: { label: "En Proceso", color: "text-purple-400", bg: "bg-purple-400/20" },
    SHIPPED: { label: "Enviado", color: "text-cyan-400", bg: "bg-cyan-400/20" },
    DELIVERED: { label: "Entregado", color: "text-green-500", bg: "bg-green-500/20" },
    CANCELLED: { label: "Cancelado", color: "text-red-400", bg: "bg-red-400/20" },
    REFUNDED: { label: "Reembolsado", color: "text-orange-400", bg: "bg-orange-400/20" },
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8 text-gradient">
          Mis Pedidos
        </h1>

      {orders.length === 0 ? (
        <div className="card text-center py-12 max-w-md mx-auto">
          <Package className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-2xl font-serif font-bold mb-2">
            No tienes pedidos aun
          </h2>
          <p className="text-gray-400 mb-6">
            Comienza a explorar nuestros productos
          </p>
          <Link href="/productos" className="btn-primary inline-block">
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const firstItem = order.items[0];
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="card hover:border-pastel-rose/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Order Image */}
                  <div className="w-20 h-20 bg-dark-accent rounded-lg overflow-hidden flex-shrink-0">
                    {firstItem?.variant.product.images[0] ? (
                      <img
                        src={firstItem.variant.product.images[0].url}
                        alt={firstItem.variant.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="text-gray-500" size={32} />
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-mono text-sm text-pastel-rose">
                        #{order.orderNumber}
                      </h3>
                      <span className={`${status.bg} ${status.color} px-3 py-1 rounded-full text-xs font-semibold`}>
                        {status.label}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mb-1">
                      {itemCount} {itemCount === 1 ? "producto" : "productos"}
                      {order.items.length > 1 && ` (${order.items.length} ${order.items.length === 1 ? "tipo" : "tipos"})`}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Order Total & Arrow */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-xl font-bold text-pastel-rose">
                        S/ {Number(order.total).toFixed(2)}
                      </p>
                    </div>
                    <ChevronRight
                      className="text-gray-400 group-hover:text-pastel-rose transition-colors"
                      size={24}
                    />
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.items.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-pastel-lavender/10">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {order.items.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="w-12 h-12 bg-dark-accent rounded flex-shrink-0 overflow-hidden"
                        >
                          {item.variant.product.images[0] && (
                            <img
                              src={item.variant.product.images[0].url}
                              alt={item.variant.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                      {order.items.length > 5 && (
                        <div className="w-12 h-12 bg-dark-accent rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                          +{order.items.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
      </div>
    </>
  );
}
