import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesion" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { variantId, quantity } = body;

    if (!variantId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Datos invalidos" },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;

    // Verify variant exists and has stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          select: {
            isActive: true,
          },
        },
      },
    });

    if (!variant || !variant.product.isActive) {
      return NextResponse.json(
        { error: "Producto no disponible" },
        { status: 404 }
      );
    }

    if (variant.stock < quantity) {
      return NextResponse.json(
        { error: "Stock insuficiente" },
        { status: 400 }
      );
    }

    // Get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;

      if (newQuantity > variant.stock) {
        return NextResponse.json(
          { error: "No hay suficiente stock disponible" },
          { status: 400 }
        );
      }

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Error al agregar al carrito" },
      { status: 500 }
    );
  }
}
