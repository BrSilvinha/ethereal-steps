import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function ProductosPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          order: "asc",
        },
        take: 1,
      },
      variants: {
        select: {
          stock: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4 text-gradient">
            Nuestros Productos
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Descubre nuestra coleccion exclusiva de calzado elegante
          </p>
        </div>

        {products.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 mb-6">
              No hay productos disponibles en este momento.
            </p>
            <Link href="/" className="btn-primary">
              Volver al Inicio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const totalStock = product.variants.reduce(
                (sum, v) => sum + v.stock,
                0
              );
              const imageUrl = product.images[0]?.url || "/placeholder-shoe.jpg";

              return (
                <Link
                  key={product.id}
                  href={`/productos/${product.slug}`}
                  className="card group hover:scale-105 transition-transform"
                >
                  <div className="aspect-square bg-dark-accent rounded-lg overflow-hidden mb-4">
                    {product.images[0] ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-pastel-lavender mb-1">
                      {product.category.name}
                    </p>
                    <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-pastel-rose transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        {product.comparePrice && (
                          <span className="text-gray-500 line-through text-sm mr-2">
                            S/ {Number(product.comparePrice).toFixed(2)}
                          </span>
                        )}
                        <span className="text-pastel-rose font-bold text-xl">
                          S/ {Number(product.price).toFixed(2)}
                        </span>
                      </div>

                      <div className="text-xs text-gray-400">
                        {totalStock > 0 ? (
                          <span className="text-pastel-mint">
                            {totalStock} disponibles
                          </span>
                        ) : (
                          <span className="text-red-400">Agotado</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
