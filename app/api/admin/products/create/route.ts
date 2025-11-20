import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function POST(request: NextRequest) {
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

    // Generate slug
    let slug = slugify(name);
    let slugExists = await prisma.product.findUnique({
      where: { slug },
    });

    let counter = 1;
    while (slugExists) {
      slug = `${slugify(name)}-${counter}`;
      slugExists = await prisma.product.findUnique({
        where: { slug },
      });
      counter++;
    }

    // Create product with images and variants
    const product = await prisma.product.create({
      data: {
        name,
        slug,
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
            sku: `${slug}-${variant.size}-${index}-${Date.now()}`,
          })) || [],
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
