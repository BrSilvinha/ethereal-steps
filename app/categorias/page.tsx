import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sparkles, ArrowRight } from "lucide-react";

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

  // Default placeholder images for categories if not set
  const categoryImages: Record<string, string> = {
    'tacones': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    'botas': 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&q=80',
    'sandalias': 'https://images.unsplash.com/photo-1603808033587-9b82ab4d9df7?w=800&q=80',
    'zapatillas': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    'flats': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
    'deportivos': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pastel-rose/10 via-pastel-lavender/10 to-pastel-mint/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="text-pastel-rose" size={24} />
              <span className="text-pastel-lavender font-semibold">Nuestras Colecciones</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-gradient">
              Categorias
            </h1>
            <p className="text-gray-300 text-lg">
              Descubre nuestra seleccion curada de calzado para cada ocasion y estilo
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {categories.length === 0 ? (
          <div className="card text-center py-16">
            <Sparkles className="mx-auto mb-4 text-pastel-lavender" size={64} />
            <h2 className="text-2xl font-semibold mb-4">No hay categorias disponibles</h2>
            <p className="text-gray-400 mb-8">
              Estamos trabajando en agregar nuevas categorias pronto
            </p>
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              Volver al Inicio
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const imageUrl = category.image || categoryImages[category.slug.toLowerCase()] || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80';

              return (
                <Link
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] border border-pastel-lavender/10 hover:border-pastel-rose/30 transition-all duration-500 hover:shadow-2xl hover:shadow-pastel-rose/20"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent"></div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-pastel-rose/40 via-pastel-lavender/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6">
                    {/* Product Count Badge */}
                    <div className="absolute top-6 right-6 bg-dark-bg/80 backdrop-blur-sm px-4 py-2 rounded-full border border-pastel-lavender/20">
                      <span className="text-pastel-rose font-bold">
                        {category._count.products}
                      </span>
                      <span className="text-gray-300 text-sm ml-1">
                        {category._count.products === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>

                    {/* Category Info */}
                    <div className="space-y-3 transform group-hover:translate-y-[-8px] transition-transform duration-500">
                      <h3 className="text-3xl font-serif font-bold text-white group-hover:text-pastel-rose transition-colors">
                        {category.name}
                      </h3>

                      {category.description && (
                        <p className="text-gray-300 text-sm line-clamp-2 opacity-90">
                          {category.description}
                        </p>
                      )}

                      {/* View Button */}
                      <div className="flex items-center gap-2 text-pastel-lavender group-hover:text-pastel-rose font-semibold transition-colors">
                        <span>Explorar coleccion</span>
                        <ArrowRight
                          size={20}
                          className="transform group-hover:translate-x-2 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pastel-rose via-pastel-lavender to-pastel-mint transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        {categories.length > 0 && (
          <div className="mt-16 text-center">
            <div className="card inline-block py-8 px-12">
              <h3 className="text-2xl font-serif font-bold mb-3">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-gray-400 mb-6">
                Explora todos nuestros productos o contactanos para ayuda personalizada
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/productos" className="btn-primary inline-flex items-center gap-2">
                  Ver Todos los Productos
                  <ArrowRight size={16} />
                </Link>
                <Link href="/contacto" className="btn-outline">
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
