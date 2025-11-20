import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
    }

    // Verify item belongs to user's cart
    const userId = (session.user as any).id;
    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: {
        variant: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item no encontrado" },
        { status: 404 }
      );
    }

    if (quantity > item.variant.stock) {
      return NextResponse.json(
        { error: "No hay suficiente stock disponible" },
        { status: 400 }
      );
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Error al actualizar carrito" },
      { status: 500 }
    );
  }
}
