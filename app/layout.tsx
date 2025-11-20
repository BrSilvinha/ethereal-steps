import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/providers/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ethereal Steps - Calzado Elegante para Dama",
  description: "Descubre nuestra exclusiva colección de calzado femenino. Elegancia y comodidad en cada paso.",
  keywords: ["calzado", "zapatos", "dama", "mujer", "elegante", "tacones", "sandalias", "botas"],
  authors: [{ name: "Ethereal Steps" }],
  openGraph: {
    title: "Ethereal Steps - Calzado Elegante para Dama",
    description: "Descubre nuestra exclusiva colección de calzado femenino",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-gradient-elegant min-h-screen">
        <SessionProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#16213e",
                  color: "#fff",
                  border: "1px solid rgba(212, 197, 232, 0.3)",
                },
                success: {
                  iconTheme: {
                    primary: "#FFB5D8",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
