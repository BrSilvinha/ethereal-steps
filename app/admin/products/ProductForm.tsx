"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X, Plus, ChevronUp, ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  id?: string;
  url: string;
  order: number;
}

interface ProductVariant {
  id?: string;
  size: string;
  stock: number;
}

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  categoryId: string;
  isActive: boolean;
  featured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
}

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

const SIZES = ["35", "36", "37", "38", "39", "40", "41", "42"];

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    comparePrice: product?.comparePrice || null,
    categoryId: product?.categoryId || (categories[0]?.id || ""),
    isActive: product?.isActive ?? true,
    featured: product?.featured ?? false,
  });

  const [images, setImages] = useState<ProductImage[]>(
    product?.images || []
  );
  const [imageUrl, setImageUrl] = useState("");

  const [variants, setVariants] = useState<ProductVariant[]>(() => {
    if (product?.variants && product.variants.length > 0) {
      // Create a map of existing variants by size
      const variantMap = new Map<string, ProductVariant>();
      product.variants.forEach(v => {
        variantMap.set(v.size, v);
      });

      // Create variants for all SIZES, using existing data if available
      return SIZES.map(size =>
        variantMap.get(size) || { size, stock: 0 }
      );
    }
    return SIZES.map(size => ({ size, stock: 0 }));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.categoryId) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (formData.price <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = product?.id
        ? `/api/admin/products/${product.id}/update`
        : "/api/admin/products/create";

      const response = await fetch(url, {
        method: product?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          variants,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al guardar producto");
      }

      toast.success(
        product?.id
          ? "Producto actualizado exitosamente"
          : "Producto creado exitosamente"
      );
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Error al guardar producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = () => {
    if (!imageUrl.trim()) {
      toast.error("Ingresa una URL valida");
      return;
    }

    setImages([...images, { url: imageUrl, order: images.length }]);
    setImageUrl("");
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    // Reorder remaining images
    const reorderedImages = updatedImages.map((img, i) => ({ ...img, order: i }));
    setImages(reorderedImages);
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    setImages(reorderedImages);
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    setImages(reorderedImages);
  };

  const updateVariantStock = (size: string, stock: number) => {
    setVariants(
      variants.map((v) => (v.size === size ? { ...v, stock } : v))
    );
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div>
        <label className="block text-sm font-semibold text-pastel-lavender mb-2">
          Nombre del Producto *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-dark-accent border border-pastel-lavender/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pastel-lavender/50"
          placeholder="Ej: Zapatos Elegantes Negros"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-pastel-lavender mb-2">
          Descripcion *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-3 bg-dark-accent border border-pastel-lavender/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pastel-lavender/50"
          placeholder="Describe el producto..."
          rows={4}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-pastel-lavender mb-2">
            Precio *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            className="w-full px-4 py-3 bg-dark-accent border border-pastel-lavender/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pastel-lavender/50"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-pastel-lavender mb-2">
            Precio de Comparacion (opcional)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.comparePrice || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                comparePrice: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            className="w-full px-4 py-3 bg-dark-accent border border-pastel-lavender/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pastel-lavender/50"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-pastel-lavender mb-2">
          Categoria *
        </label>
        <select
          value={formData.categoryId}
          onChange={(e) =>
            setFormData({ ...formData, categoryId: e.target.value })
          }
          className="w-full px-4 py-3 bg-dark-accent border border-pastel-lavender/20 rounded-lg text-white focus:outline-none focus:border-pastel-lavender/50"
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="w-5 h-5 rounded border-pastel-lavender/20 bg-dark-accent text-pastel-rose focus:ring-pastel-rose"
          />
          <span className="text-sm text-white">Producto Activo</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="w-5 h-5 rounded border-pastel-lavender/20 bg-dark-accent text-pastel-rose focus:ring-pastel-rose"
          />
          <span className="text-sm text-white">Producto Destacado</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-pastel-lavender mb-2">
          Imagenes del Producto
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="URL de la imagen"
            className="flex-1 px-4 py-3 bg-dark-accent border border-pastel-lavender/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pastel-lavender/50"
          />
          <button
            type="button"
            onClick={addImage}
            className="btn-primary whitespace-nowrap"
          >
            <Plus size={20} />
            Agregar
          </button>
        </div>

        {images.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400">
              La primera imagen sera la imagen principal del producto
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative group bg-dark-accent rounded-lg p-2">
                  <div className="aspect-square rounded-lg overflow-hidden mb-2">
                    <img
                      src={img.url}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs text-pastel-lavender font-semibold">
                      #{index + 1}
                      {index === 0 && " (Principal)"}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveImageUp(index)}
                        disabled={index === 0}
                        className="p-1 bg-pastel-lavender/20 hover:bg-pastel-lavender/30 text-pastel-lavender rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Mover arriba"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImageDown(index)}
                        disabled={index === images.length - 1}
                        className="p-1 bg-pastel-lavender/20 hover:bg-pastel-lavender/30 text-pastel-lavender rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Mover abajo"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                        title="Eliminar"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-pastel-lavender mb-2">
          Inventario por Talla
        </label>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {variants.map((variant, index) => (
            <div key={`variant-${variant.size}-${index}`}>
              <label className="block text-xs text-gray-400 mb-1">
                Talla {variant.size}
              </label>
              <input
                type="number"
                min="0"
                value={variant.stock}
                onChange={(e) =>
                  updateVariantStock(variant.size, parseInt(e.target.value) || 0)
                }
                className="w-full px-2 py-2 bg-dark-accent border border-pastel-lavender/20 rounded text-white text-center focus:outline-none focus:border-pastel-lavender/50"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {isSubmitting
            ? "Guardando..."
            : product?.id
            ? "Actualizar Producto"
            : "Crear Producto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
