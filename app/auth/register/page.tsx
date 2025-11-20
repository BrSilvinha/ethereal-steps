"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contrasenas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Error al registrar usuario");
        return;
      }

      toast.success("Cuenta creada exitosamente!");

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Error al iniciar sesion");
        router.push("/auth/login");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Error al registrar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif mb-2 text-gradient">
            Crear Cuenta
          </h1>
          <p className="text-gray-400">
            Unete a Ethereal Steps y descubre nuestra coleccion exclusiva
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nombre Completo
              </label>
              <input
                id="name"
                type="text"
                required
                className="input w-full"
                placeholder="Maria Garcia"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="input w-full"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Contrasena
              </label>
              <input
                id="password"
                type="password"
                required
                className="input w-full"
                placeholder="********"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <p className="text-xs text-gray-400 mt-1">
                Minimo 6 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirmar Contrasena
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="input w-full"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>

            <p className="text-xs text-gray-400">
              Al crear una cuenta, aceptas nuestros{" "}
              <Link href="/terms" className="text-pastel-rose hover:underline">
                Terminos y Condiciones
              </Link>{" "}
              y{" "}
              <Link href="/privacy" className="text-pastel-rose hover:underline">
                Politica de Privacidad
              </Link>
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pastel-lavender/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-secondary text-gray-400">
                Ya tienes cuenta?
              </span>
            </div>
          </div>

          <Link href="/auth/login" className="btn-outline w-full block text-center">
            Iniciar Sesion
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-pastel-lavender transition-colors"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
