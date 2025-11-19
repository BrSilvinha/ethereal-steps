// Types compartidos para toda la aplicación

export interface ProductWithImages {
  id: string
  name: string
  description: string
  slug: string
  price: number
  comparePrice?: number | null
  images: ProductImage[]
  category: {
    id: string
    name: string
    slug: string
  }
  variants: ProductVariant[]
  featured: boolean
  isActive: boolean
}

export interface ProductImage {
  id: string
  url: string
  alt?: string | null
  order: number
}

export interface ProductVariant {
  id: string
  size: string
  color: string
  colorHex?: string | null
  stock: number
  sku: string
}

export interface CartItemWithProduct {
  id: string
  quantity: number
  variant: ProductVariant & {
    product: {
      id: string
      name: string
      price: number
      images: ProductImage[]
    }
  }
}

export interface OrderWithDetails {
  id: string
  orderNumber: string
  items: OrderItemWithProduct[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: string
  shippingAddress: Address
  payment?: Payment | null
  invoice?: Invoice | null
  createdAt: Date
}

export interface OrderItemWithProduct {
  id: string
  quantity: number
  price: number
  variant: ProductVariant & {
    product: {
      id: string
      name: string
      images: ProductImage[]
    }
  }
}

export interface Address {
  id: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Payment {
  id: string
  amount: number
  currency: string
  stripePaymentId?: string | null
  paymentMethod: string
  status: string
  paidAt?: Date | null
}

export interface Invoice {
  id: string
  invoiceNumber: string
  invoiceType: 'BOLETA' | 'FACTURA'
  customerName: string
  customerEmail: string
  customerPhone: string
  customerDoc: string
  customerAddress?: string | null
  ruc?: string | null
  businessName?: string | null
  pdfUrl?: string | null
  issuedAt: Date
}
