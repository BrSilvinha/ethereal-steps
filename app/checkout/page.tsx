import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";
import Navbar from "@/components/layout/Navbar";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session || !session.user) {
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
                  images: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <>
      <Navbar />
      <CheckoutClient cart={cart} user={session.user} />
    </>
  );
}
