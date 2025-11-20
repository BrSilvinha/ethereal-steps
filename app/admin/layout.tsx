"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, Users, FolderOpen, Menu, X } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { name: "Dashboard", href: "/admin", Icon: LayoutDashboard },
  { name: "Productos", href: "/admin/products", Icon: Package },
  { name: "Pedidos", href: "/admin/orders", Icon: ShoppingCart },
  { name: "Clientes", href: "/admin/customers", Icon: Users },
  { name: "Categorias", href: "/admin/categories", Icon: FolderOpen },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-rose mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-secondary border border-pastel-lavender/10 rounded-lg"
      >
        {showMobileMenu ? (
          <X className="text-white" size={24} />
        ) : (
          <Menu className="text-white" size={24} />
        )}
      </button>

      {/* Backdrop for mobile menu */}
      {showMobileMenu && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-dark-secondary border-r border-pastel-lavender/10 flex flex-col
        fixed lg:static inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-pastel-lavender/10">
          <Link href="/" className="text-2xl font-serif text-gradient">
            Ethereal Steps
          </Link>
          <p className="text-sm text-gray-400 mt-1">Panel de Administracion</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-pastel-rose text-dark-primary font-semibold"
                    : "text-gray-300 hover:bg-dark-accent hover:text-white"
                }`}
              >
                <IconComponent size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-pastel-lavender/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-pastel-rose/20 flex items-center justify-center">
              <span className="text-pastel-rose font-semibold">
                {session.user?.name?.[0] || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full btn-outline text-sm py-2"
          >
            Cerrar Sesion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="p-4 md:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
