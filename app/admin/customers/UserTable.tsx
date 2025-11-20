"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: {
    orders: number;
  };
}

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Confirmas cambiar el rol de este usuario a ${newRole}?`)) {
      return;
    }

    setLoadingUserId(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Error al cambiar rol");
      }

      toast.success("Rol actualizado exitosamente");
      router.refresh();
    } catch (error) {
      toast.error("Error al cambiar rol");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-pastel-lavender/10">
            <th className="text-left py-3 px-4 text-sm font-semibold text-pastel-lavender">
              Usuario
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-pastel-lavender">
              Email
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-pastel-lavender">
              Rol
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-pastel-lavender">
              Pedidos
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-pastel-lavender">
              Registrado
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-pastel-lavender">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">
                No se encontraron usuarios
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-pastel-lavender/5 hover:bg-dark-accent/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{user.name || "Sin nombre"}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-400 text-sm">
                  {user.email}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-pastel-rose/20 text-pastel-rose"
                        : "bg-pastel-lavender/20 text-pastel-lavender"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">{user._count.orders}</td>
                <td className="py-3 px-4 text-gray-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString("es-ES")}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={loadingUserId === user.id}
                    className="bg-dark-accent border border-pastel-lavender/30 text-white text-sm rounded px-2 py-1 cursor-pointer hover:border-pastel-rose/50 transition-colors disabled:opacity-50"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
