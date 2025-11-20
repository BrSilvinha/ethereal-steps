import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { shippingInfo, paymentMethod } = body;

    // Validate required fields
    if (!shippingInfo || !paymentMethod) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "El carrito esta vacio" },
        { status: 400 }
      );
    }

    // Check stock availability for all items
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `No hay suficiente stock para ${item.variant.product.name} (Talla ${item.variant.size})`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) =>
        sum + Number(item.variant.product.price) * item.quantity,
      0
    );
    const tax = 0; // No tax for now
    const shipping = 0; // Free shipping
    const total = subtotal + tax + shipping;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // First create the address
      const address = await tx.address.create({
        data: {
          userId,
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state || "",
          zipCode: shippingInfo.postalCode || "",
          country: "Perú",
          isDefault: false,
        },
      });

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          addressId: address.id,
          subtotal,
          tax,
          shipping,
          total,
          status: "PENDING",
          notes: shippingInfo.notes || null,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.variant.product.price,
            })),
          },
          payment: {
            create: {
              amount: total,
              currency: "PEN",
              paymentMethod: paymentMethod,
              status: "PENDING",
            },
          },
        },
      });

      // Update stock for each variant
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}
