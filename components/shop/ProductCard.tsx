'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: { url: string; alt?: string | null }[];
    category: {
      name: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Card variant="product" className="relative overflow-hidden">
      {/* Etiqueta de descuento */}
      {hasDiscount && (
        <div className="absolute top-4 right-4 z-10 bg-pastel-rose text-dark-primary px-3 py-1 rounded-full text-sm font-bold">
          -{discountPercentage}%
        </div>
      )}

      {/* Imagen del producto */}
      <Link href={`/productos/${product.slug}`} className="block relative aspect-square mb-4 overflow-hidden rounded-lg">
        <Image
          src={product.images[0]?.url || '/images/placeholder.jpg'}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay con acciones rápidas */}
        <div className="absolute inset-0 bg-dark-primary/0 group-hover:bg-dark-primary/40 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button className="bg-white/90 p-3 rounded-full hover:bg-pastel-rose hover:text-white transition-colors">
            <Heart size={20} />
          </button>
          <button className="bg-white/90 p-3 rounded-full hover:bg-pastel-rose hover:text-white transition-colors">
            <ShoppingCart size={20} />
          </button>
        </div>
      </Link>

      {/* Información del producto */}
      <div className="space-y-2">
        <p className="text-xs text-pastel-lavender uppercase tracking-wider">
          {product.category.name}
        </p>

        <Link href={`/productos/${product.slug}`}>
          <h3 className="text-lg font-serif font-semibold text-white group-hover:text-pastel-rose transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <p className="text-xl font-bold text-pastel-rose">
            {formatPrice(product.price)}
          </p>
          {hasDiscount && (
            <p className="text-sm text-white/50 line-through">
              {formatPrice(product.comparePrice!)}
            </p>
          )}
        </div>
      </div>

      {/* Botón de añadir al carrito */}
      <div className="mt-4">
        <Button variant="primary" className="w-full" size="sm">
          <ShoppingCart size={16} className="mr-2" />
          Añadir al Carrito
        </Button>
      </div>
    </Card>
  );
}
