import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatear precio en Soles Peruanos
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(numPrice)
}

// Generar slug desde un string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Generar número de orden único
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ES-${timestamp}-${random}`
}

// Generar SKU para variantes de productos
export function generateSKU(productName: string, size: string, color: string): string {
  const productCode = productName
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
  const colorCode = color.substring(0, 2).toUpperCase()
  const sizeCode = size.replace('.', '')
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()

  return `${productCode}-${colorCode}${sizeCode}-${random}`
}

// Validar DNI/RUC peruano
export function validateDNI(dni: string): boolean {
  return /^\d{8}$/.test(dni)
}

export function validateRUC(ruc: string): boolean {
  return /^\d{11}$/.test(ruc)
}
