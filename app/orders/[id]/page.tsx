import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, Package, Truck, MapPin, CreditCard, Calendar } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const userId = (session.user as any).id;
  const isAdmin = (session.user as any).role === "ADMIN";

  const order = await prisma.order.findUnique({
    where: { id: params.id },
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
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      shippingAddress: true,
      payment: true,
    },
  });

  if (!order) {
    redirect("/orders");
  }

  // Check if user owns this order or is admin
  if (order.userId !== userId && !isAdmin) {
    redirect("/orders");
  }

  const statusConfig = {
    PENDING: { label: "Pendiente de Pago", color: "text-yellow-400", bg: "bg-yellow-400/20" },
    PAID: { label: "Pagado", color: "text-green-400", bg: "bg-green-400/20" },
    PROCESSING: { label: "En Proceso", color: "text-purple-400", bg: "bg-purple-400/20" },
    SHIPPED: { label: "Enviado", color: "text-cyan-400", bg: "bg-cyan-400/20" },
    DELIVERED: { label: "Entregado", color: "text-green-500", bg: "bg-green-500/20" },
    CANCELLED: { label: "Cancelado", color: "text-red-400", bg: "bg-red-400/20" },
    REFUNDED: { label: "Reembolsado", color: "text-orange-400", bg: "bg-orange-400/20" },
  };

  const paymentMethodLabels = {
    CASH: "Efectivo contra entrega",
    CARD: "Tarjeta de Credito/Debito",
    BANK_TRANSFER: "Transferencia Bancaria",
    YAPE: "Yape",
    PLIN: "Plin",
  };

  const status = statusConfig[order.status];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          href="/orders"
          className="text-pastel-lavender hover:text-pastel-rose transition-colors"
        >
          &larr; Volver a mis pedidos
        </Link>
      </div>

      {/* Success Header */}
      <div className="card mb-8 text-center py-8">
        <CheckCircle className="mx-auto text-pastel-mint mb-4" size={64} />
        <h1 className="text-3xl font-serif font-bold mb-2">
          Pedido Realizado con Exito!
        </h1>
        <p className="text-gray-400">
          Numero de pedido: <span className="text-pastel-rose font-mono">#{order.orderNumber}</span>
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Te hemos enviado un correo de confirmacion a {order.user.email}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-2xl font-serif font-bold mb-6">
              Productos del Pedido
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => {
                const product = item.variant.product;
                const imageUrl = product.images[0]?.url || "/placeholder-shoe.jpg";

                return (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-pastel-lavender/10 last:border-0">
                    <Link
                      href={`/productos/${product.slug}`}
                      className="w-20 h-20 bg-dark-accent rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1">
                      <Link
                        href={`/productos/${product.slug}`}
                        className="font-serif text-lg font-semibold hover:text-pastel-rose transition-colors"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">
                        Color: {item.variant.color} | Talla: {item.variant.size}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Cantidad: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-pastel-rose font-bold">
                        S/ {(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        S/ {Number(item.price).toFixed(2)} c/u
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-pastel-rose" size={24} />
              <h2 className="text-2xl font-serif font-bold">
                Direccion de Envio
              </h2>
            </div>

            <div className="bg-dark-accent p-4 rounded-lg space-y-2">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p className="text-gray-300">{order.shippingAddress.phone}</p>
              <p className="text-gray-300">{order.shippingAddress.street}</p>
              <p className="text-gray-300">
                {order.shippingAddress.city}
                {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                {order.shippingAddress.zipCode && ` ${order.shippingAddress.zipCode}`}
              </p>
              <p className="text-gray-300">{order.shippingAddress.country}</p>
              {order.notes && (
                <div className="mt-3 pt-3 border-t border-pastel-lavender/10">
                  <p className="text-sm text-gray-400">Notas:</p>
                  <p className="text-gray-300">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-pastel-rose" size={24} />
              <h2 className="text-xl font-serif font-bold">Estado del Pedido</h2>
            </div>

            <div className={`${status.bg} ${status.color} px-4 py-3 rounded-lg text-center font-semibold`}>
              {status.label}
            </div>

            <div className="mt-4 pt-4 border-t border-pastel-lavender/10">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={16} />
                <span>
                  {new Date(order.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Total */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-pastel-rose" size={24} />
              <h2 className="text-xl font-serif font-bold">Pago</h2>
            </div>

            <div className="bg-dark-accent p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-400">Metodo de Pago</p>
              <p className="font-semibold">
                {order.payment ? paymentMethodLabels[order.payment.paymentMethod as keyof typeof paymentMethodLabels] : "N/A"}
              </p>
              {order.payment && (
                <p className="text-xs text-gray-400 mt-1">
                  Estado: {order.payment.status === "PENDING" ? "Pendiente" : order.payment.status === "COMPLETED" ? "Completado" : order.payment.status}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>S/ {Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Envio</span>
                <span className="text-pastel-mint">{Number(order.shipping) === 0 ? "GRATIS" : `S/ ${Number(order.shipping).toFixed(2)}`}</span>
              </div>
              {Number(order.tax) > 0 && (
                <div className="flex justify-between text-gray-300">
                  <span>Impuestos</span>
                  <span>S/ {Number(order.tax).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-pastel-lavender/20 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-pastel-rose">
                    S/ {Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="card bg-pastel-lavender/5">
            <h3 className="font-semibold mb-2">Necesitas Ayuda?</h3>
            <p className="text-sm text-gray-400 mb-4">
              Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
            </p>
            <Link href="/contacto" className="btn-outline block text-center">
              Contactar Soporte
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
