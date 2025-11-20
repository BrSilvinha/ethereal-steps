"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    products: number;
  };
}

interface CategoriesTableProps {
  categories: Category[];
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: string;
    categoryName: string;
    productCount: number;
  }>({ isOpen: false, categoryId: "", categoryName: "", productCount: 0 });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    try {
      const response = await fetch("/api/admin/categories/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al crear categoria");
      }

      toast.success("Categoria creada exitosamente");
      setIsCreating(false);
      setFormData({ name: "", description: "" });
      router.refresh();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error al crear categoria");
    }
  };

  const handleUpdate = async (categoryId: string, name: string, description: string) => {
    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar categoria");
      }

      toast.success("Categoria actualizada exitosamente");
      setIsEditing(null);
      router.refresh();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error al actualizar categoria");
    }
  };

  const handleDelete = async () => {
    if (deleteModal.productCount > 0) {
      toast.error("No se puede eliminar una categoria con productos asociados");
      return;
    }

    setIsDeleting(deleteModal.categoryId);
    try {
      const response = await fetch(`/api/admin/categories/${deleteModal.categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar categoria");
      }

      toast.success("Categoria eliminada exitosamente");
      router.refresh();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error al eliminar categoria");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary"
        >
          <Plus size={20} />
          Nueva Categoria
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="card mb-6 p-6">
          <h3 className="text-xl font-serif font-bold text-pastel-rose mb-4">
            Nueva Categoria
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-pastel-lavender mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-dark-accent border border-pastel-lavender/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pastel-lavender/50"
                placeholder="Ej: Tacones"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-pastel-lavender mb-2">
                Descripcion
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-dark-accent border border-pastel-lavender/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pastel-lavender/50"
                placeholder="Descripcion de la categoria..."
                rows={3}
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                Crear Categoria
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setFormData({ name: "", description: "" });
                }}
                className="btn-outline"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">No hay categorias disponibles.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pastel-lavender/10">
                <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                  Nombre
                </th>
                <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                  Slug
                </th>
                <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                  Descripcion
                </th>
                <th className="text-left py-4 px-4 font-semibold text-pastel-lavender">
                  Productos
                </th>
                <th className="text-right py-4 px-4 font-semibold text-pastel-lavender">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-pastel-lavender/5 hover:bg-dark-accent/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    {isEditing === category.id ? (
                      <input
                        type="text"
                        defaultValue={category.name}
                        id={`name-${category.id}`}
                        className="px-3 py-2 bg-dark-accent border border-pastel-lavender/20 rounded text-white focus:outline-none focus:border-pastel-lavender/50"
                      />
                    ) : (
                      <p className="font-semibold">{category.name}</p>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-400">
                    {category.slug}
                  </td>
                  <td className="py-4 px-4">
                    {isEditing === category.id ? (
                      <textarea
                        defaultValue={category.description || ""}
                        id={`desc-${category.id}`}
                        className="px-3 py-2 bg-dark-accent border border-pastel-lavender/20 rounded text-white focus:outline-none focus:border-pastel-lavender/50 w-full"
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm text-gray-400">
                        {category.description || "Sin descripcion"}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-pastel-mint">
                      {category._count.products}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing === category.id ? (
                        <>
                          <button
                            onClick={() => {
                              const nameInput = document.getElementById(
                                `name-${category.id}`
                              ) as HTMLInputElement;
                              const descInput = document.getElementById(
                                `desc-${category.id}`
                              ) as HTMLTextAreaElement;
                              handleUpdate(
                                category.id,
                                nameInput.value,
                                descInput.value
                              );
                            }}
                            className="px-3 py-1 bg-pastel-mint text-dark-bg rounded-lg text-sm font-semibold"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setIsEditing(null)}
                            className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsEditing(category.id)}
                            className="p-2 hover:bg-pastel-lavender/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil size={18} className="text-pastel-lavender" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                categoryId: category.id,
                                categoryName: category.name,
                                productCount: category._count.products,
                              })
                            }
                            disabled={isDeleting === category.id}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Eliminar"
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            categoryId: "",
            categoryName: "",
            productCount: 0,
          })
        }
        onConfirm={handleDelete}
        title="Eliminar Categoria"
        message={
          deleteModal.productCount > 0
            ? `No se puede eliminar la categoria "${deleteModal.categoryName}" porque tiene ${deleteModal.productCount} producto(s) asociado(s). Debes reasignar o eliminar los productos primero.`
            : `Estas seguro de eliminar la categoria "${deleteModal.categoryName}"? Esta accion no se puede deshacer.`
        }
        confirmText="Si, Eliminar"
        cancelText="Cancelar"
        type={deleteModal.productCount > 0 ? "warning" : "danger"}
      />
    </div>
  );
}
