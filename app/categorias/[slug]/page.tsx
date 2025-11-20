import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          images: {
            orderBy: { order: "asc" },
            take: 1,
          },
          variants: {
            select: { stock: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/categorias" className="text-pastel-lavender hover:text-pastel-rose transition-colors">
            &larr; Volver a Categorias
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4 text-gradient">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-400 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
          <p className="text-pastel-mint mt-4">
            {category.products.length} {category.products.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        {category.products.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 mb-6">
              No hay productos disponibles en esta categoria.
            </p>
            <Link href="/productos" className="btn-primary">
              Ver Todos los Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.products.map((product) => {
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
