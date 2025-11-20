import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ count: 0 });
    }

    const userId = (session.user as any).id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          select: {
            quantity: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ count: 0 });
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ count: totalItems });
  } catch (error) {
    console.error("Error getting cart count:", error);
    return NextResponse.json({ count: 0 });
  }
}
