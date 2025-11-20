import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import CartClient from "./CartClient";

export default async function CartPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const userId = (session.user as any).id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: { order: "asc" },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartClient cart={cart} />
    </div>
  );
}
