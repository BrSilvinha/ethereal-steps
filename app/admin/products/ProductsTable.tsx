"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  isActive: boolean;
  featured: boolean;
  category: {
    name: string;
  };
  images: Array<{
    url: string;
  }>;
  variants: Array<{
    stock: number;
  }>;
}

interface ProductsTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}

export default function ProductsTable({
  products,
  currentPage,
  totalPages,
  searchQuery,
}: ProductsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({ isOpen: false, productId: "", productName: "" });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleDelete = async () => {
    setIsDeleting(deleteModal.productId);
    try {
      const response = await fetch(`/api/admin/products/${deleteModal.productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar producto");
      }

      toast.success("Producto eliminado exitosamente");
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar producto");
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar estado");
      }

      toast.success("Estado actualizado exitosamente");
      router.refresh();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Error al actualizar estado");
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o descripcion..."
            className="w-full pl-10 pr-4 py-3 bg-dark-accent border border-pastel-lavender/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pastel-lavender/50"
          />
        </div>
      </form>

      {products.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">No se encontraron productos.</p>
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pastel-lavender/10">
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Producto
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Categoria
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Precio
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Stock
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                    Estado
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-pastel-lavender">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-pastel-lavender/5 hover:bg-dark-accent/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-dark-accent rounded flex items-center justify-center text-gray-500 text-xs">
                              Sin img
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-400 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">{product.category.name}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-bold text-pastel-rose">
                            S/ {Number(product.price).toFixed(2)}
                          </p>
                          {product.comparePrice && (
                            <p className="text-xs text-gray-500 line-through">
                              S/ {Number(product.comparePrice).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-sm ${
                            totalStock > 0 ? "text-pastel-mint" : "text-red-400"
                          }`}
                        >
                          {totalStock}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleActive(product.id, product.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.isActive
                              ? "bg-pastel-mint/20 text-pastel-mint"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {product.isActive ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 hover:bg-pastel-lavender/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil size={18} className="text-pastel-lavender" />
                          </Link>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                productId: product.id,
                                productName: product.name,
                              })
                            }
                            disabled={isDeleting === product.id}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Eliminar"
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const params = new URLSearchParams();
                params.set("page", page.toString());
                if (searchQuery) params.set("search", searchQuery);

                return (
                  <Link
                    key={page}
                    href={`/admin/products?${params.toString()}`}
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

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, productId: "", productName: "" })
        }
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`Estas seguro de eliminar el producto "${deleteModal.productName}"? Esta accion no se puede deshacer.`}
        confirmText="Si, Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}
