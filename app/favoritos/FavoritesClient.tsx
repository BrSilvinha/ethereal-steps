"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

interface Favorite {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
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
      stock: number;
    }>;
  };
}

interface FavoritesClientProps {
  favorites: Favorite[];
}

export default function FavoritesClient({ favorites: initialFavorites }: FavoritesClientProps) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveFavorite = async (productId: string) => {
    setRemovingId(productId);
    try {
      const response = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar de favoritos");
      }

      const data = await response.json();
      setFavorites(favorites.filter((fav) => fav.product.id !== productId));
      toast.success(data.message);
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Error al eliminar de favoritos");
    } finally {
      setRemovingId(null);
    }
  };

  const getTotalStock = (variants: Array<{ stock: number }>) => {
    return variants.reduce((sum, v) => sum + v.stock, 0);
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center">
          Mis Favoritos
        </h1>
        <div className="text-center py-16">
          <Heart className="mx-auto mb-4 text-pastel-lavender" size={64} />
          <h2 className="text-2xl font-semibold mb-4">No tienes favoritos aun</h2>
          <p className="text-gray-400 mb-8">
            Agrega productos a tus favoritos para verlos aqui
          </p>
          <Link href="/productos" className="btn-primary">
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold mb-2 text-center">
        Mis Favoritos
      </h1>
      <p className="text-center text-gray-400 mb-12">
        {favorites.length} {favorites.length === 1 ? "producto guardado" : "productos guardados"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((favorite) => {
          const { product } = favorite;
          const totalStock = getTotalStock(product.variants);
          const discount = product.comparePrice
            ? Math.round(
                ((Number(product.comparePrice) - Number(product.price)) /
                  Number(product.comparePrice)) *
                  100
              )
            : 0;

          return (
            <div
              key={favorite.id}
              className="card group hover:shadow-xl hover:shadow-pastel-rose/10 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-dark-accent">
                <Link href={`/productos/${product.slug}`}>
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Sin imagen
                    </div>
                  )}
                </Link>

                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-pastel-rose text-dark-primary px-3 py-1 rounded-full text-sm font-bold">
                    -{discount}%
                  </div>
                )}

                {/* Stock Badge */}
                {totalStock === 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Agotado
                  </div>
                )}

                {/* Remove from Favorites */}
                <button
                  onClick={() => handleRemoveFavorite(product.id)}
                  disabled={removingId === product.id}
                  className="absolute top-3 right-3 bg-dark-bg/80 p-2 rounded-full hover:bg-dark-bg transition-colors disabled:opacity-50"
                >
                  <Heart
                    size={20}
                    className="text-pastel-rose"
                    fill="currentColor"
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link
                  href={`/categorias/${product.category.slug}`}
                  className="text-xs text-pastel-lavender hover:text-pastel-rose transition-colors"
                >
                  {product.category.name}
                </Link>

                <Link href={`/productos/${product.slug}`}>
                  <h3 className="font-semibold text-lg mt-1 mb-2 hover:text-pastel-rose transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xl font-bold text-pastel-rose">
                      S/ {Number(product.price).toFixed(2)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        S/ {Number(product.comparePrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Info */}
                {totalStock > 0 ? (
                  <p className="text-xs text-pastel-mint mb-3">
                    {totalStock} disponibles
                  </p>
                ) : (
                  <p className="text-xs text-red-400 mb-3">Sin stock</p>
                )}

                {/* View Product Button */}
                <Link
                  href={`/productos/${product.slug}`}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag size={16} />
                  Ver Producto
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
