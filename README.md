# 🌸 Ethereal Steps

![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

E-commerce elegante especializado en calzado femenino con panel de administración completo, sistema de autenticación y proceso de compra optimizado.

## ✨ Características

### Para Clientes
- 🛍️ Catálogo de productos con filtros por categoría
- 🎨 Selección de color y talla por producto
- 🛒 Carrito de compras con actualización en tiempo real
- 💳 Proceso de checkout completo con múltiples métodos de pago
- 📦 Seguimiento de pedidos
- ❤️ Sistema de favoritos (próximamente)
- 🔐 Autenticación segura con NextAuth.js v5

### Para Administradores
- 📊 Panel de administración completo
- 📦 Gestión de productos (CRUD completo)
  - Múltiples imágenes por producto
  - Variantes por color y talla
  - Control de inventario
- 📂 Gestión de categorías
- 👥 Gestión de usuarios con paginación
- 📋 Gestión de pedidos con estados personalizables
- 🔍 Búsqueda y filtros avanzados

## 🚀 Tecnologías

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Estilos**: Tailwind CSS con tema personalizado oscuro/pastel
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js v5 (beta) con JWT
- **Validación**: Bcrypt para contraseñas
- **UI/UX**:
  - Lucide React (iconos)
  - React Hot Toast (notificaciones)
  - Modales personalizados con animaciones
  - Diseño responsive

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.x o superior ([Descargar](https://nodejs.org/))
- **npm** o **yarn** (viene con Node.js)
- **PostgreSQL** 14 o superior ([Descargar](https://www.postgresql.org/download/))
- **Git** ([Descargar](https://git-scm.com/))

## 🔧 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ethereal-steps.git
cd ethereal-steps
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Base de Datos PostgreSQL

#### Opción A: PostgreSQL Local

1. **Crear una base de datos**:
   ```sql
   CREATE DATABASE ethereal_steps;
   ```

2. **Crear usuario (opcional)**:
   ```sql
   CREATE USER ethereal_user WITH PASSWORD 'tu_contraseña_segura';
   GRANT ALL PRIVILEGES ON DATABASE ethereal_steps TO ethereal_user;
   ```

#### Opción B: PostgreSQL en la Nube (Recomendado para producción)

Servicios gratuitos/económicos:
- [Supabase](https://supabase.com/) - PostgreSQL gratuito
- [Railway](https://railway.app/) - PostgreSQL con plan gratuito
- [Neon](https://neon.tech/) - PostgreSQL serverless gratuito

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/ethereal_steps"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secret-seguro-aqui"
# Genera el secret con: openssl rand -base64 32

# App Configuration (opcional)
NODE_ENV="development"
```

#### Ejemplo de DATABASE_URL para diferentes servicios:

**PostgreSQL Local:**
```
DATABASE_URL="postgresql://ethereal_user:tu_contraseña@localhost:5432/ethereal_steps"
```

**Supabase:**
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Railway:**
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway"
```

### 5. Generar el Cliente de Prisma y Ejecutar Migraciones

```bash
# Genera el cliente de Prisma
npx prisma generate

# Ejecuta las migraciones para crear las tablas
npx prisma migrate deploy

# O en desarrollo, usa:
npx prisma migrate dev --name init
```

### 6. Poblar la Base de Datos (Seed)

Ejecuta el script de seed para crear datos iniciales:

```bash
npx prisma db seed
```

Esto creará:
- ✅ Usuario administrador por defecto
  - Email: `admin@etherealsteps.com`
  - Contraseña: `admin123`
- ✅ Usuario cliente de prueba
  - Email: `cliente@ejemplo.com`
  - Contraseña: `cliente123`
- ✅ Categorías de ejemplo
- ✅ Productos de ejemplo con imágenes y variantes

**⚠️ IMPORTANTE**: Cambia las contraseñas en producción.

### 7. Ejecutar el Proyecto en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 8. (Opcional) Abrir Prisma Studio

Para gestionar tu base de datos visualmente:

```bash
npx prisma studio
```

Prisma Studio se abrirá en [http://localhost:5555](http://localhost:5555)

## 📁 Estructura del Proyecto

```
ethereal-steps/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación (layout separado)
│   │   └── auth/
│   │       ├── login/
│   │       └── register/
│   ├── admin/                    # Panel de administración
│   │   ├── categories/
│   │   ├── customers/
│   │   ├── orders/
│   │   └── products/
│   ├── api/                      # API Routes
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── cart/
│   │   └── orders/
│   ├── cart/                     # Carrito de compras
│   ├── categorias/               # Catálogo por categorías
│   ├── checkout/                 # Proceso de pago
│   ├── contacto/                 # Página de contacto
│   ├── orders/                   # Pedidos del usuario
│   ├── productos/                # Catálogo de productos
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Página de inicio
│   └── globals.css               # Estilos globales
├── components/                   # Componentes React
│   ├── layout/                   # Navbar, Footer
│   ├── providers/                # Context Providers
│   └── ui/                       # Componentes UI reutilizables
├── contexts/                     # Context API
│   └── CartContext.tsx           # Contexto del carrito
├── hooks/                        # Custom React Hooks
├── lib/                          # Utilidades
│   ├── auth.ts                   # Configuración NextAuth
│   └── prisma.ts                 # Cliente Prisma
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Schema de la base de datos
│   └── seed.ts                   # Script de datos iniciales
├── public/                       # Archivos estáticos
├── .env                          # Variables de entorno (NO SUBIR A GIT)
├── .env.example                  # Ejemplo de variables de entorno
├── package.json                  # Dependencias
├── tailwind.config.ts            # Configuración Tailwind
└── tsconfig.json                 # Configuración TypeScript
```

## 🗄️ Esquema de Base de Datos

### Modelos Principales

```prisma
User {
  - id: String (UUID)
  - name: String
  - email: String (único)
  - password: String (hash)
  - role: ADMIN | USER
  - createdAt: DateTime
}

Category {
  - id: String (UUID)
  - name: String
  - slug: String (único)
  - description: String?
}

Product {
  - id: String (UUID)
  - name: String
  - slug: String (único)
  - description: String
  - price: Decimal
  - comparePrice: Decimal?
  - isActive: Boolean
  - categoryId: String
}

ProductVariant {
  - id: String (UUID)
  - productId: String
  - size: String (35-42)
  - color: String
  - colorHex: String?
  - stock: Int
  - sku: String (único)
}

ProductImage {
  - id: String (UUID)
  - productId: String
  - url: String
  - order: Int
}

Order {
  - id: String (UUID)
  - userId: String
  - total: Decimal
  - status: PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED
  - paymentMethod: CASH | CARD | TRANSFER
  - shippingAddress: String (JSON)
}

Cart {
  - id: String (UUID)
  - userId: String (único)
}

CartItem {
  - id: String (UUID)
  - cartId: String
  - variantId: String
  - quantity: Int
}
```

## 🔐 Autenticación y Roles

### Roles de Usuario

- **ADMIN**: Acceso completo al panel de administración
- **USER**: Cliente con acceso a compras y pedidos

### Rutas Protegidas

- `/admin/*` - Solo administradores
- `/cart` - Solo usuarios autenticados
- `/checkout` - Solo usuarios autenticados
- `/orders` - Solo usuarios autenticados

### Implementación

La autenticación usa **NextAuth.js v5** con:
- Strategy: JWT
- Provider: Credentials
- Password hashing: Bcrypt (10 rounds)

## 🎨 Tema y Diseño

### Paleta de Colores

```css
--dark-bg: #0F1419        /* Fondo principal oscuro */
--dark-secondary: #16213E /* Fondo secundario */
--dark-accent: #1A2332    /* Acentos oscuros */

--pastel-rose: #FFB5D8    /* Rosa pastel (primario) */
--pastel-lavender: #D4C5E8 /* Lavanda pastel */
--pastel-mint: #B5E8D3    /* Menta pastel */
--pastel-peach: #FFD4B5   /* Durazno pastel */
```

### Fuentes

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo
npm run build            # Construye para producción
npm run start            # Inicia servidor de producción
npm run lint             # Ejecuta ESLint

# Base de Datos
npx prisma studio        # Abre Prisma Studio
npx prisma generate      # Genera cliente Prisma
npx prisma migrate dev   # Crea y aplica migración
npx prisma db seed       # Pobla la base de datos
npx prisma db push       # Sincroniza schema sin migración
```

## 🚀 Deployment

### Vercel (Recomendado)

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conectar con Vercel**
   - Visita [vercel.com](https://vercel.com)
   - Importa tu repositorio
   - Vercel detectará Next.js automáticamente

3. **Configurar Variables de Entorno**
   En Vercel Dashboard → Settings → Environment Variables:
   ```
   DATABASE_URL=tu_database_url_de_produccion
   NEXTAUTH_URL=https://tu-dominio.vercel.app
   NEXTAUTH_SECRET=tu_secret_de_produccion
   ```

4. **Deploy**
   - Vercel hará deploy automáticamente
   - Ejecuta migraciones: `npx prisma migrate deploy`

### Otras Opciones

- **Railway**: Soporta Next.js + PostgreSQL
- **Render**: Servicio gratuito con PostgreSQL incluido
- **DigitalOcean App Platform**: Con base de datos managed

## 🔧 Configuración Adicional

### Personalizar el Seed

Edita `prisma/seed.ts` para cambiar los datos iniciales:

```typescript
// Cambiar usuario admin
const admin = await prisma.user.create({
  data: {
    email: "tu-email@ejemplo.com",
    name: "Tu Nombre",
    password: await bcrypt.hash("tu-contraseña", 10),
    role: "ADMIN",
  },
});
```

### Añadir Más Productos

Puedes agregar productos desde:
- Panel Admin → Productos → Nuevo Producto
- Prisma Studio → Tabla `Product`
- Modificando `prisma/seed.ts`

## 🐛 Troubleshooting

### Error: "Can't reach database server"

```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status  # Linux
brew services list              # macOS
```

### Error: "Invalid credentials"

- Verifica el `DATABASE_URL` en `.env`
- Asegúrate de que la base de datos existe
- Verifica usuario y contraseña

### Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### La página admin no carga

- Verifica que estés logueado como ADMIN
- Revisa el rol en la base de datos:
  ```sql
  SELECT email, role FROM "User";
  ```

### El contador del carrito no se actualiza

- Verifica que `CartProvider` esté en `app/layout.tsx`
- Revisa la consola del navegador para errores
- Limpia caché del navegador

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Usa TypeScript estricto
- Sigue las convenciones de nombres de Next.js
- Documenta componentes complejos
- Añade tests cuando sea posible
- Actualiza el README si añades features

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👥 Autores

- **Tu Nombre** - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Next.js Team
- Prisma Team
- Tailwind CSS
- NextAuth.js
- Comunidad de código abierto

## 📧 Soporte

Si tienes preguntas o necesitas ayuda:

- 🐛 [Reportar un bug](https://github.com/tu-usuario/ethereal-steps/issues)
- 💡 [Solicitar una feature](https://github.com/tu-usuario/ethereal-steps/issues)
- 📧 Email: soporte@etherealsteps.com

---

Hecho con ❤️ y ☕ por el equipo de Ethereal Steps
