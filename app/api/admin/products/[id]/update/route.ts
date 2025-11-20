import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      comparePrice,
      categoryId,
      isActive,
      featured,
      images,
      variants,
    } = body;

    if (!name || !description || !categoryId || !price) {
      return NextResponse.json(
        { error: "Campos requeridos faltantes" },
        { status: 400 }
      );
    }

    // Get all variants of this product first
    const existingVariants = await prisma.productVariant.findMany({
      where: { productId: params.id },
      select: { id: true },
    });

    const variantIds = existingVariants.map((v) => v.id);

    // Delete related records in correct order
    if (variantIds.length > 0) {
      // 1. Delete cart items that reference the variants
      await prisma.cartItem.deleteMany({
        where: { variantId: { in: variantIds } },
      });

      // 2. Delete order items that reference the variants
      await prisma.orderItem.deleteMany({
        where: { variantId: { in: variantIds } },
      });
    }

    // 3. Delete existing images
    await prisma.productImage.deleteMany({
      where: { productId: params.id },
    });

    // 4. Delete existing variants
    await prisma.productVariant.deleteMany({
      where: { productId: params.id },
    });

    // Update product with new data
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        comparePrice,
        categoryId,
        isActive: isActive ?? true,
        featured: featured ?? false,
        images: {
          create: images?.map((img: any, index: number) => ({
            url: img.url,
            order: index,
          })) || [],
        },
        variants: {
          create: variants?.map((variant: any, index: number) => ({
            size: variant.size,
            stock: variant.stock,
            color: variant.color || "Default",
            colorHex: variant.colorHex || null,
            sku: `${params.id}-${variant.size}-${index}-${Date.now()}`,
          })) || [],
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}
