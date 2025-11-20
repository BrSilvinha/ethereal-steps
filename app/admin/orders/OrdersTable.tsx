"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
  items: Array<{
    quantity: number;
    variant: {
      product: {
        name: string;
      };
    };
  }>;
}

interface OrdersTableProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  selectedStatus?: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  PROCESSING: "bg-blue-500/20 text-blue-400",
  SHIPPED: "bg-purple-500/20 text-purple-400",
  DELIVERED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export default function OrdersTable({
  orders,
  currentPage,
  totalPages,
  selectedStatus,
}: OrdersTableProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState(selectedStatus || "");

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    router.push(`/admin/orders?${params.toString()}`);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar estado");
      }

      toast.success("Estado actualizado exitosamente");
      router.refresh();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error al actualizar estado");
    }
  };

  return (
    <div>
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => handleStatusFilter("")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !statusFilter
              ? "bg-pastel-rose text-white"
              : "bg-dark-accent text-gray-400 hover:bg-pastel-lavender/10"
          }`}
        >
          Todos
        </button>
        {Object.keys(STATUS_LABELS).map((status) => (
          <button
            key={status}
            onClick={() => handleStatusFilter(status)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === status
                ? "bg-pastel-rose text-white"
                : "bg-dark-accent text-gray-400 hover:bg-pastel-lavender/10"
            }`}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">No se encontraron pedidos.</p>
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pastel-lavender/10">
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Pedido
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Cliente
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Items
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Total
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Estado
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Fecha
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-pastel-lavender">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-pastel-lavender/5 hover:bg-dark-accent/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold">#{order.orderNumber}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.user.name || "Sin nombre"}</p>
                        <p className="text-sm text-gray-400">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-pastel-rose">
                        S/ {Number(order.total).toFixed(2)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_COLORS[order.status]
                        } bg-transparent border-0 cursor-pointer`}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value} className="bg-dark-bg text-white">
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("es-PE")}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 hover:bg-pastel-lavender/10 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={18} className="text-pastel-lavender" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const params = new URLSearchParams();
                params.set("page", page.toString());
                if (selectedStatus) params.set("status", selectedStatus);

                return (
                  <Link
                    key={page}
                    href={`/admin/orders?${params.toString()}`}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-pastel-rose text-white"
                        : "bg-dark-accent text-gray-400 hover:bg-pastel-lavender/10"
                    }`}
                  >
                    {page}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
