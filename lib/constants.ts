// Constantes globales de la aplicación Ethereal Steps

export const SITE_NAME = 'Ethereal Steps';
export const SITE_DESCRIPTION = 'Calzado elegante y sofisticado para la mujer moderna';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Configuración de la tienda
export const STORE_CONFIG = {
  currency: 'PEN',
  currencySymbol: 'S/',
  locale: 'es-PE',
  country: 'Perú',
  defaultShippingCost: 15.00,
  freeShippingThreshold: 150.00,
  taxRate: 0.18, // IGV 18%
};

// Tallas disponibles
export const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42'];

// Colores populares
export const POPULAR_COLORS = [
  { name: 'Negro', hex: '#000000' },
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Rosa Pastel', hex: '#FFB5D8' },
  { name: 'Lavanda', hex: '#D4C5E8' },
  { name: 'Menta', hex: '#C5E8DB' },
  { name: 'Nude', hex: '#E8C4B8' },
  { name: 'Gris', hex: '#808080' },
  { name: 'Dorado', hex: '#D4AF37' },
  { name: 'Plateado', hex: '#C0C0C0' },
];

// Estados de orden
export const ORDER_STATUS = {
  PENDING: { label: 'Pendiente', color: 'yellow' },
  PAID: { label: 'Pagado', color: 'green' },
  PROCESSING: { label: 'En Proceso', color: 'blue' },
  SHIPPED: { label: 'Enviado', color: 'purple' },
  DELIVERED: { label: 'Entregado', color: 'green' },
  CANCELLED: { label: 'Cancelado', color: 'red' },
  REFUNDED: { label: 'Reembolsado', color: 'orange' },
};

// Métodos de pago disponibles
export const PAYMENT_METHODS = {
  CARD: 'Tarjeta de Crédito/Débito',
  YAPE: 'Yape',
  PLIN: 'Plin',
  BANK_TRANSFER: 'Transferencia Bancaria',
  CASH: 'Efectivo (Contra Entrega)',
};

// Categorías de productos
export const PRODUCT_CATEGORIES = [
  { name: 'Tacones', slug: 'tacones' },
  { name: 'Sandalias', slug: 'sandalias' },
  { name: 'Botas', slug: 'botas' },
  { name: 'Casuales', slug: 'casuales' },
  { name: 'Deportivos', slug: 'deportivos' },
  { name: 'Plataformas', slug: 'plataformas' },
];

// Límites de paginación
export const PAGINATION = {
  productsPerPage: 12,
  reviewsPerPage: 10,
  ordersPerPage: 20,
};

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  required: 'Este campo es requerido',
  email: 'Ingresa un email válido',
  password: 'La contraseña debe tener al menos 8 caracteres',
  phone: 'Ingresa un número de teléfono válido',
  dni: 'El DNI debe tener 8 dígitos',
  ruc: 'El RUC debe tener 11 dígitos',
};

// Redes sociales
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/etherealsteps',
  instagram: 'https://instagram.com/etherealsteps',
  tiktok: 'https://tiktok.com/@etherealsteps',
  whatsapp: 'https://wa.me/51987654321',
};

// Información de contacto
export const CONTACT_INFO = {
  email: 'hola@etherealsteps.com',
  phone: '+51 987 654 321',
  address: 'Av. Larco 1234, Miraflores, Lima, Perú',
  workingHours: 'Lun - Sáb: 10:00 AM - 8:00 PM',
};

// Políticas de la tienda
export const POLICIES = {
  returnsWindow: 30, // días para devoluciones
  warrantyPeriod: 90, // días de garantía
  maxItemsInCart: 50,
  minOrderAmount: 50.00,
};

// Placeholder images (Unsplash)
export const PLACEHOLDER_IMAGES = {
  product: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
  user: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  banner: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1920',
  category: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600',
};
