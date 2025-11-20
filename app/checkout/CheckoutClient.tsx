"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Truck, MapPin, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
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

interface User {
  name?: string | null;
  email?: string | null;
}

interface CheckoutClientProps {
  cart: Cart;
  user: User;
}

export default function CheckoutClient({ cart, user }: CheckoutClientProps) {
  const router = useRouter();
  const { refreshCount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "BANK_TRANSFER" | "YAPE" | "PLIN">("CASH");

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.variant.product.price) * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingInfo,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al procesar el pedido");
      }

      const data = await response.json();

      toast.success("Pedido realizado con exito!");
      await refreshCount(); // Update cart count to 0
      router.push(`/orders/${data.orderId}`);
    } catch (error: any) {
      console.error("Error processing order:", error);
      toast.error(error.message || "Error al procesar el pedido");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          href="/cart"
          className="text-pastel-lavender hover:text-pastel-rose transition-colors"
        >
          &larr; Volver al carrito
        </Link>
      </div>

      <h1 className="text-4xl font-serif font-bold mb-8 text-gradient">
        Finalizar Compra
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="text-pastel-rose" size={24} />
                <h2 className="text-2xl font-serif font-bold">
                  Informacion de Envio
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-dark-accent border border-pastel-lavender/20 rounded-lg focus:outline-none focus:border-pastel-rose transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Telefono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-dark-accent border border-pastel-lavender/20 rounded-lg focus:outline-none focus:border-pastel-rose transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Correo Electronico
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full px-4 py-2 bg-dark-accent/50 border border-pastel-lavender/10 rounded-lg text-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Direccion *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Calle, numero, departamento, etc."
                    className="w-full px-4 py-2 bg-dark-accent border border-pastel-lavender/20 rounded-lg focus:outline-none focus:border-pastel-rose transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-dark-accent border border-pastel-lavender/20 rounded-lg focus:outline-none focus:border-pastel-rose transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Departamento
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-dark-accent border border-pastel-lavender/20 rounded-lg focus:outline-none focus:border-pastel-rose transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Codigo Postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-dark-accent border border-pastel-lavender/20 rounded-lg focus:outline-none focus:border-pastel-rose transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    name="notes"
                    value={shippingInfo.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Instrucciones de entrega, referencias, etc."
                    className="w-full px-4 py-2 bg-dark-accent border border-pastel-lavender/20 rounded-lg focus:outline-none focus:border-pastel-rose transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-pastel-rose" size={24} />
                <h2 className="text-2xl font-serif font-bold">
                  Metodo de Pago
                </h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-dark-accent rounded-lg cursor-pointer hover:bg-pastel-lavender/10 transition-colors border-2 border-transparent has-[:checked]:border-pastel-rose">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH"
                    checked={paymentMethod === "CASH"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">Pago contra entrega</p>
                    <p className="text-sm text-gray-400">
                      Paga en efectivo cuando recibas tu pedido
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-dark-accent rounded-lg cursor-pointer hover:bg-pastel-lavender/10 transition-colors border-2 border-transparent has-[:checked]:border-pastel-rose">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={paymentMethod === "CARD"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">Tarjeta de Credito/Debito</p>
                    <p className="text-sm text-gray-400">
                      Paga con tarjeta al recibir tu pedido
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-dark-accent rounded-lg cursor-pointer hover:bg-pastel-lavender/10 transition-colors border-2 border-transparent has-[:checked]:border-pastel-rose">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">Transferencia Bancaria</p>
                    <p className="text-sm text-gray-400">
                      Te enviaremos los datos bancarios por correo
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-dark-accent rounded-lg cursor-pointer hover:bg-pastel-lavender/10 transition-colors border-2 border-transparent has-[:checked]:border-pastel-rose">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="YAPE"
                    checked={paymentMethod === "YAPE"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">Yape</p>
                    <p className="text-sm text-gray-400">
                      Te enviaremos el número para realizar el pago
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-dark-accent rounded-lg cursor-pointer hover:bg-pastel-lavender/10 transition-colors border-2 border-transparent has-[:checked]:border-pastel-rose">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PLIN"
                    checked={paymentMethod === "PLIN"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">Plin</p>
                    <p className="text-sm text-gray-400">
                      Te enviaremos el número para realizar el pago
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h2 className="text-2xl font-serif font-bold mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => {
                  const product = item.variant.product;
                  const imageUrl = product.images[0]?.url || "/placeholder-shoe.jpg";

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-dark-accent rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.variant.color} - Talla {item.variant.size}
                        </p>
                        <p className="text-sm text-pastel-rose">
                          {item.quantity} x S/ {Number(product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-pastel-lavender/20 pt-4 space-y-3 mb-6">
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
                      S/ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Procesando..." : "Realizar Pedido"}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Al realizar el pedido, aceptas nuestros terminos y condiciones
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
