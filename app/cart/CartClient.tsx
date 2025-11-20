"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useCart } from "@/contexts/CartContext";

interface CartItem {
  id: string;
  quantity: number;
  variant: {
    id: string;
    size: string;
    color: string;
    stock: number;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      images: Array<{
        url: string;
      }>;
    };
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

interface CartClientProps {
  cart: Cart | null;
}

export default function CartClient({ cart }: CartClientProps) {
  const router = useRouter();
  const { refreshCount } = useCart();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string;
    productName: string;
  }>({ isOpen: false, itemId: "", productName: "" });
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(itemId);
    try {
      const response = await fetch(`/api/cart/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar");
      }

      toast.success("Cantidad actualizada");
      await refreshCount();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar cantidad");
    } finally {
      setIsUpdating(null);
    }
  };

  const removeItem = async () => {
    try {
      const response = await fetch(`/api/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: deleteModal.itemId }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      toast.success("Producto eliminado del carrito");
      await refreshCount();
      router.refresh();
    } catch (error) {
      toast.error("Error al eliminar producto");
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="card text-center py-12 max-w-md mx-auto">
          <ShoppingBag className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-2xl font-serif font-bold mb-2">
            Tu carrito esta vacio
          </h2>
          <p className="text-gray-400 mb-6">
            Agrega productos para comenzar tu compra
          </p>
          <Link href="/productos" className="btn-primary inline-block">
            Ir a Productos
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.variant.product.price) * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8 text-gradient">
        Mi Carrito
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = item.variant.product;
            const imageUrl = product.images[0]?.url || "/placeholder-shoe.jpg";

            return (
              <div key={item.id} className="card flex gap-4">
                <Link
                  href={`/productos/${product.slug}`}
                  className="w-24 h-24 bg-dark-accent rounded-lg overflow-hidden flex-shrink-0"
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
                  <p className="text-pastel-rose font-bold mt-2">
                    S/ {Number(product.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        itemId: item.id,
                        productName: product.name,
                      })
                    }
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || isUpdating === item.id}
                      className="p-1 bg-dark-accent hover:bg-pastel-lavender/20 rounded transition-colors disabled:opacity-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={
                        item.quantity >= item.variant.stock ||
                        isUpdating === item.id
                      }
                      className="p-1 bg-dark-accent hover:bg-pastel-lavender/20 rounded transition-colors disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-2xl font-serif font-bold mb-6">
              Resumen del Pedido
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Envio</span>
                <span className="text-pastel-mint">GRATIS</span>
              </div>
              <div className="border-t border-pastel-lavender/20 pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-pastel-rose">
                    S/ {subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link href="/checkout" className="w-full btn-primary mb-3 block text-center">
              Proceder al Pago
            </Link>
            <Link
              href="/productos"
              className="block text-center text-pastel-lavender hover:text-pastel-rose transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, itemId: "", productName: "" })
        }
        onConfirm={removeItem}
        title="Eliminar Producto"
        message={`Estas seguro de eliminar "${deleteModal.productName}" del carrito?`}
        confirmText="Si, Eliminar"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  );
}
