import Link from "next/link";
import { Sparkles, ShoppingBag, Shield, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header/Navbar Simple */}
      <header className="glass border-b border-pastel-lavender/10 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-pastel-rose" size={32} />
            <h1 className="text-2xl font-serif font-bold text-gradient">
              Ethereal Steps
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white/80 hover:text-pastel-rose transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-white/80 hover:text-pastel-rose transition-colors">
              Productos
            </Link>
            <Link href="/categorias" className="text-white/80 hover:text-pastel-rose transition-colors">
              Categorías
            </Link>
            <Link href="/contacto" className="text-white/80 hover:text-pastel-rose transition-colors">
              Contacto
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-white/80 hover:text-pastel-rose transition-colors">
              Ingresar
            </Link>
            <Link href="/carrito" className="relative">
              <ShoppingBag className="text-pastel-rose" size={24} />
              <span className="absolute -top-2 -right-2 bg-pastel-rose text-dark-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>
          </div>
        </nav>
      </header>

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

      {/* Categorías Preview */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-serif font-bold text-center mb-12">
          <span className="text-gradient">Nuestras Categorías</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {["Tacones", "Sandalias", "Botas", "Casuales"].map((category) => (
            <Link
              key={category}
              href={`/categorias/${category.toLowerCase()}`}
              className="card-product aspect-square flex items-center justify-center"
            >
              <h3 className="text-2xl font-serif font-bold text-pastel-rose group-hover:scale-110 transition-transform">
                {category}
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
