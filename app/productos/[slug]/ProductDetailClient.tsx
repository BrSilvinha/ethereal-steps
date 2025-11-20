"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  category: {
    name: string;
    slug: string;
  };
  images: Array<{
    url: string;
  }>;
  variants: Array<{
    id: string;
    size: string;
    color: string;
    colorHex: string | null;
    stock: number;
  }>;
}

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { refreshCount } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Get unique colors
  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color))
  );

  // Auto-select first color if none selected
  if (!selectedColor && availableColors.length > 0) {
    setSelectedColor(availableColors[0]);
  }

  // Get variants for selected color
  const variantsForColor = product.variants.filter(
    (v) => v.color === selectedColor
  );

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  // Check if product is in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      if (!session) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await fetch("/api/favorites/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkFavorite();
  }, [session, product.id]);

  const handleToggleFavorite = async () => {
    if (!session) {
      toast.error("Debes iniciar sesion para agregar a favoritos");
      router.push("/auth/login");
      return;
    }

    setIsTogglingFavorite(true);
    try {
      const response = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar favoritos");
      }

      const data = await response.json();
      setIsFavorite(data.isFavorite);
      toast.success(data.message);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Error al actualizar favoritos");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Debes iniciar sesion para agregar productos al carrito");
      router.push("/auth/login");
      return;
    }

    if (!selectedSize) {
      toast.error("Por favor selecciona una talla");
      return;
    }

    if (!selectedVariant || selectedVariant.stock === 0) {
      toast.error("Talla no disponible");
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar al carrito");
      }

      toast.success("Producto agregado al carrito");
      await refreshCount(); // Update cart count immediately
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error al agregar al carrito");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          href="/productos"
          className="text-pastel-lavender hover:text-pastel-rose transition-colors"
        >
          &larr; Volver a productos
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square bg-dark-accent rounded-lg overflow-hidden mb-4">
            {product.images.length > 0 ? (
              <>
                <img
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-dark-bg/80 p-2 rounded-full hover:bg-dark-bg transition-colors"
                    >
                      <ChevronLeft className="text-white" size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-dark-bg/80 p-2 rounded-full hover:bg-dark-bg transition-colors"
                    >
                      <ChevronRight className="text-white" size={24} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Sin imagen
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-pastel-rose"
                      : "border-transparent hover:border-pastel-lavender/50"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-2">
            <Link
              href={`/categorias/${product.category.slug}`}
              className="text-pastel-lavender text-sm hover:text-pastel-rose transition-colors"
            >
              {product.category.name}
            </Link>
          </div>

          <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-pastel-rose">
              S/ {Number(product.price).toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-500 line-through">
                S/ {Number(product.comparePrice).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-300 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Color Selection */}
          {availableColors.length > 1 && (
            <div className="mb-6">
              <label className="block font-semibold text-pastel-lavender mb-3">
                Color
              </label>
              <div className="flex gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize(""); // Reset size when color changes
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedColor === color
                        ? "bg-pastel-rose text-dark-bg"
                        : "bg-dark-accent text-white hover:bg-pastel-lavender/20 border border-pastel-lavender/20"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="block font-semibold text-pastel-lavender">
                Selecciona tu talla
              </label>
              {totalStock > 0 ? (
                <span className="text-sm text-pastel-mint">
                  {totalStock} disponibles
                </span>
              ) : (
                <span className="text-sm text-red-400">Agotado</span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {variantsForColor.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedSize(variant.size)}
                  disabled={variant.stock === 0}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    selectedSize === variant.size
                      ? "bg-pastel-rose text-dark-bg"
                      : variant.stock > 0
                      ? "bg-dark-accent text-white hover:bg-pastel-lavender/20 hover:border-pastel-lavender border border-pastel-lavender/20"
                      : "bg-dark-accent/50 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || totalStock === 0 || !selectedSize}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              {isAddingToCart
                ? "Agregando..."
                : totalStock === 0
                ? "Agotado"
                : "Agregar al Carrito"}
            </button>

            {!session && (
              <p className="text-center text-sm text-gray-400">
                <Link href="/auth/login" className="text-pastel-lavender hover:text-pastel-rose">
                  Inicia sesion
                </Link>{" "}
                para comprar este producto
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className={`flex-1 btn-outline flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFavorite ? "text-pastel-rose border-pastel-rose" : ""
                }`}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
              </button>
              <button className="flex-1 btn-outline flex items-center justify-center gap-2">
                <Share2 size={20} />
                Compartir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
