import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function ContactoPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4 text-gradient">
            Contacto
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Estamos aqui para ayudarte
          </p>
        </div>

        <div className="max-w-2xl mx-auto card">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-pastel-rose">Email</h3>
              <p className="text-gray-400">contacto@etherealsteps.com</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-pastel-lavender">Telefono</h3>
              <p className="text-gray-400">+51 999 999 999</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-pastel-mint">Horario</h3>
              <p className="text-gray-400">Lunes a Sabado: 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="btn-primary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
