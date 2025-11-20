import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import FavoritesClient from "./FavoritesClient";

export const metadata = {
  title: "Mis Favoritos - Ethereal Steps",
  description: "Tus productos favoritos guardados",
};

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          category: true,
          images: {
            take: 1,
            orderBy: { order: "asc" },
          },
          variants: {
            select: {
              stock: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />
      <FavoritesClient favorites={favorites} />
    </>
  );
}
