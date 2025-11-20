"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Sparkles, ShoppingBag, User, LogOut, Settings, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { count: cartCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="glass border-b border-pastel-lavender/10 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="text-pastel-rose" size={32} />
            <h1 className="text-xl md:text-2xl font-serif font-bold text-gradient">
              Ethereal Steps
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-white/80 hover:text-pastel-rose transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className="text-white/80 hover:text-pastel-rose transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/categorias"
              className="text-white/80 hover:text-pastel-rose transition-colors"
            >
              Categorias
            </Link>
            <Link
              href="/contacto"
              className="text-white/80 hover:text-pastel-rose transition-colors"
            >
              Contacto
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-pastel-lavender/20 animate-pulse"></div>
            ) : session ? (
              <>
                <Link href="/cart" className="relative">
                  <ShoppingBag className="text-pastel-rose" size={24} />
                  <span className="absolute -top-2 -right-2 bg-pastel-rose text-dark-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-white/80 hover:text-pastel-rose transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-pastel-rose/20 flex items-center justify-center">
                      <span className="text-pastel-rose font-semibold text-sm">
                        {session.user?.name?.[0] || "U"}
                      </span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 card shadow-2xl">
                      <div className="px-4 py-3 border-b border-pastel-lavender/10">
                        <p className="text-sm font-medium">{session.user?.name}</p>
                        <p className="text-xs text-gray-400">{session.user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-2 text-xs bg-pastel-rose text-dark-primary px-2 py-1 rounded-full">
                            Administradora
                          </span>
                        )}
                      </div>
                      <div className="py-2">
                        <Link
                          href="/favoritos"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-dark-accent transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart size={16} />
                          <span className="text-sm">Mis Favoritos</span>
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-dark-accent transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ShoppingBag size={16} />
                          <span className="text-sm">Mis Pedidos</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-dark-accent transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings size={16} />
                            <span className="text-sm">Panel Admin</span>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-dark-accent transition-colors w-full text-left text-pastel-rose"
                        >
                          <LogOut size={16} />
                          <span className="text-sm">Cerrar Sesion</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 text-white/80 hover:text-pastel-rose transition-colors"
                >
                  <User size={20} />
                  <span className="hidden md:inline">Ingresar</span>
                </Link>
                <Link href="/auth/register" className="btn-primary hidden md:block">
                  Registrarse
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-dark-accent rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <X className="text-white" size={24} />
              ) : (
                <Menu className="text-white" size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-pastel-lavender/10 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white/80 hover:text-pastel-rose transition-colors px-4 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className="text-white/80 hover:text-pastel-rose transition-colors px-4 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Productos
              </Link>
              <Link
                href="/categorias"
                className="text-white/80 hover:text-pastel-rose transition-colors px-4 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Categorias
              </Link>
              <Link
                href="/contacto"
                className="text-white/80 hover:text-pastel-rose transition-colors px-4 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Contacto
              </Link>

              {!session && (
                <Link
                  href="/auth/register"
                  className="btn-primary mx-4"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Registrarse
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop for user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
