import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4 text-gradient">
            Categorias
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explora nuestras diferentes categorias de calzado
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 mb-6">
              No hay categorias disponibles en este momento.
            </p>
            <Link href="/" className="btn-primary">
              Volver al Inicio
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="card text-center py-12 hover:scale-105 transition-transform group"
              >
                <h3 className="text-2xl font-serif font-bold text-pastel-rose group-hover:text-pastel-lavender transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-400 mt-2 text-sm">
                  {category._count.products} {category._count.products === 1 ? 'producto' : 'productos'}
                </p>
                {category.description && (
                  <p className="text-white/60 mt-3 text-sm px-4">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
