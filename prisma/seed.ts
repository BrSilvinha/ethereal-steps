import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar base de datos
  await prisma.review.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Base de datos limpiada');

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('12345678', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Ethereal',
      email: 'admin@etherealsteps.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'María González',
      email: 'maria@example.com',
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Usuarios creados');

  // Crear categorías
  const categorias = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Tacones',
        slug: 'tacones',
        description: 'Tacones elegantes para toda ocasión',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sandalias',
        slug: 'sandalias',
        description: 'Sandalias cómodas y modernas',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Botas',
        slug: 'botas',
        description: 'Botas de temporada',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Casuales',
        slug: 'casuales',
        description: 'Calzado casual para el día a día',
      },
    }),
  ]);

  console.log('✅ Categorías creadas');

  // Crear productos de ejemplo
  const productos = [
    {
      name: 'Tacón Rosa Clásico',
      description: 'Elegante tacón rosa pastel con acabado satinado. Perfecto para eventos formales y ocasiones especiales.',
      slug: 'tacon-rosa-clasico',
      price: 189.90,
      comparePrice: 249.90,
      categoryId: categorias[0].id,
      featured: true,
      colors: [
        { name: 'Rosa Pastel', hex: '#FFB5D8' },
        { name: 'Lavanda', hex: '#D4C5E8' },
      ],
    },
    {
      name: 'Sandalia Menta Verano',
      description: 'Sandalia fresca en tono menta con diseño minimalista. Ideal para días de verano.',
      slug: 'sandalia-menta-verano',
      price: 129.90,
      categoryId: categorias[1].id,
      featured: true,
      colors: [
        { name: 'Menta', hex: '#C5E8DB' },
        { name: 'Blanco', hex: '#FFFFFF' },
      ],
    },
    {
      name: 'Bota Lavanda Invernal',
      description: 'Bota de media caña en tono lavanda con forro interno. Calidez y estilo.',
      slug: 'bota-lavanda-invernal',
      price: 279.90,
      comparePrice: 329.90,
      categoryId: categorias[2].id,
      featured: false,
      colors: [
        { name: 'Lavanda', hex: '#D4C5E8' },
        { name: 'Negro', hex: '#000000' },
      ],
    },
    {
      name: 'Casual Rosa Sport',
      description: 'Zapatilla deportiva con detalles en rosa pastel. Comodidad todo el día.',
      slug: 'casual-rosa-sport',
      price: 159.90,
      categoryId: categorias[3].id,
      featured: true,
      colors: [
        { name: 'Rosa', hex: '#FFB5D8' },
        { name: 'Gris', hex: '#808080' },
      ],
    },
    {
      name: 'Tacón Alto Elegante',
      description: 'Tacón de aguja con plataforma. Máxima elegancia y altura.',
      slug: 'tacon-alto-elegante',
      price: 219.90,
      categoryId: categorias[0].id,
      featured: false,
      colors: [
        { name: 'Negro', hex: '#000000' },
        { name: 'Nude', hex: '#E8C4B8' },
      ],
    },
    {
      name: 'Sandalia Plana Dorada',
      description: 'Sandalia plana con detalles dorados. Perfecta para el día a día.',
      slug: 'sandalia-plana-dorada',
      price: 89.90,
      categoryId: categorias[1].id,
      featured: false,
      colors: [
        { name: 'Dorado', hex: '#D4AF37' },
        { name: 'Plateado', hex: '#C0C0C0' },
      ],
    },
  ];

  const tallas = ['35', '36', '37', '38', '39', '40', '41'];

  for (const producto of productos) {
    const { colors, ...productoData } = producto;

    const productoCreado = await prisma.product.create({
      data: {
        ...productoData,
        images: {
          create: [
            {
              url: `https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800`,
              alt: producto.name,
              order: 0,
            },
            {
              url: `https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800`,
              alt: `${producto.name} - Vista 2`,
              order: 1,
            },
          ],
        },
        variants: {
          create: colors.flatMap((color) =>
            tallas.map((talla) => ({
              size: talla,
              color: color.name,
              colorHex: color.hex,
              stock: Math.floor(Math.random() * 20) + 5,
              sku: `${producto.slug.substring(0, 3).toUpperCase()}-${color.name.substring(0, 2).toUpperCase()}${talla}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
            }))
          ),
        },
      },
    });

    console.log(`✅ Producto creado: ${productoCreado.name}`);
  }

  console.log('✅ Productos creados');

  // Crear dirección de ejemplo
  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'María González',
      phone: '987654321',
      street: 'Av. Larco 1234',
      city: 'Lima',
      state: 'Lima',
      zipCode: '15074',
      country: 'Perú',
      isDefault: true,
    },
  });

  console.log('✅ Dirección creada');

  // Crear carrito vacío
  await prisma.cart.create({
    data: {
      userId: customer.id,
    },
  });

  console.log('✅ Carrito creado');

  console.log('🎉 Seed completado exitosamente!');
  console.log('\n📊 Datos creados:');
  console.log(`   - 2 usuarios (admin@etherealsteps.com / maria@example.com)`);
  console.log(`   - 4 categorías`);
  console.log(`   - ${productos.length} productos con múltiples variantes`);
  console.log(`   - Password para todos: 12345678`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
