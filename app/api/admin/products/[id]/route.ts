import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get all variants of this product first
    const variants = await prisma.productVariant.findMany({
      where: { productId: params.id },
      select: { id: true },
    });

    const variantIds = variants.map((v) => v.id);

    // Delete related records in correct order
    // 1. Delete cart items that reference the variants
    if (variantIds.length > 0) {
      await prisma.cartItem.deleteMany({
        where: { variantId: { in: variantIds } },
      });

      // 2. Delete order items that reference the variants
      await prisma.orderItem.deleteMany({
        where: { variantId: { in: variantIds } },
      });
    }

    // 3. Delete reviews for this product
    await prisma.review.deleteMany({
      where: { productId: params.id },
    });

    // 4. Delete product images (has onDelete: Cascade, but let's be explicit)
    await prisma.productImage.deleteMany({
      where: { productId: params.id },
    });

    // 5. Delete product variants (has onDelete: Cascade, but let's be explicit)
    await prisma.productVariant.deleteMany({
      where: { productId: params.id },
    });

    // 6. Finally delete the product
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
