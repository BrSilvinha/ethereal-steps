import Link from "next/link";
import { Sparkles, Shield, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      featured: true,
    },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" },
        take: 1,
      },
      variants: {
        select: { stock: true },
      },
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.category.findMany({
    take: 4,
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-7xl font-serif font-bold mb-6">
            <span className="text-gradient">
              Elegancia en Cada Paso
            </span>
          </h2>
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            Descubre nuestra exclusiva colección de calzado femenino.
            Diseños únicos que combinan estilo, comodidad y sofisticación.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/productos" className="btn-primary">
              Ver Colección
            </Link>
            <Link href="/nuevos" className="btn-outline">
              Nuevos Arribos
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-pastel-rose/20 p-4 rounded-full">
                <Truck className="text-pastel-rose" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-serif font-bold mb-2 text-pastel-rose">
              Envío Gratis
            </h3>
            <p className="text-white/70">
              En compras mayores a S/150 a todo el Perú
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-pastel-lavender/20 p-4 rounded-full">
                <Shield className="text-pastel-lavender" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-serif font-bold mb-2 text-pastel-lavender">
              Pago Seguro
            </h3>
            <p className="text-white/70">
              Transacciones protegidas con certificado SSL
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-pastel-mint/20 p-4 rounded-full">
                <Sparkles className="text-pastel-mint" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-serif font-bold mb-2 text-pastel-mint">
              Calidad Premium
            </h3>
            <p className="text-white/70">
              Materiales de primera y diseños exclusivos
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">
            <span className="text-gradient">Productos Destacados</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
              const imageUrl = product.images[0]?.url;

              return (
                <Link
                  key={product.id}
                  href={`/productos/${product.slug}`}
                  className="card group hover:scale-105 transition-transform"
                >
                  <div className="aspect-square bg-dark-accent rounded-lg overflow-hidden mb-4">
                    {imageUrl ? (
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
                    <h3 className="font-serif text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-pastel-rose font-bold">
                        S/ {Number(product.price).toFixed(2)}
                      </span>
                      <span className="text-xs text-pastel-mint">
                        {totalStock} disponibles
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/productos" className="btn-primary">
              Ver Todos los Productos
            </Link>
          </div>
        </section>
      )}

      {/* Categorías Preview */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-serif font-bold text-center mb-12">
          <span className="text-gradient">Nuestras Categorias</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="card group aspect-square flex items-center justify-center hover:scale-105 transition-transform"
            >
              <h3 className="text-2xl font-serif font-bold text-pastel-rose group-hover:scale-110 transition-transform">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pastel-lavender/10 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif font-bold text-xl mb-4 text-pastel-rose">
                Ethereal Steps
              </h3>
              <p className="text-white/70 text-sm">
                Calzado elegante y sofisticado para la mujer moderna.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-pastel-lavender">Comprar</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/productos">Todos los Productos</Link></li>
                <li><Link href="/nuevos">Nuevos Arribos</Link></li>
                <li><Link href="/ofertas">Ofertas</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-pastel-lavender">Ayuda</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/contacto">Contacto</Link></li>
                <li><Link href="/envios">Envíos</Link></li>
                <li><Link href="/devoluciones">Devoluciones</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-pastel-lavender">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/privacidad">Privacidad</Link></li>
                <li><Link href="/terminos">Términos</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-pastel-lavender/10 mt-8 pt-8 text-center text-white/50 text-sm">
            <p>&copy; 2025 Ethereal Steps. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
