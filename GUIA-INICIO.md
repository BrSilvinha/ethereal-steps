# Guía de Inicio Rápido - Ethereal Steps

## ¡Bienvenido! 👋

Esta es tu guía para comenzar a trabajar en tu tienda de e-commerce **Ethereal Steps**.

## 🎯 Próximos Pasos (Orden Recomendado)

### 1️⃣ Instalar Dependencias

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
cd "C:\Users\jhami\OneDrive\Documentos\proyectos\ethereal-steps"
npm install
```

Esto instalará todas las librerías necesarias (Next.js, Tailwind, Prisma, etc.).

### 2️⃣ Configurar Base de Datos PostgreSQL

**Opción A: Usar PostgreSQL Local**

1. Instala PostgreSQL desde: https://www.postgresql.org/download/
2. Crea una base de datos llamada `ethereal_steps`
3. Tu `DATABASE_URL` será:
   ```
   postgresql://postgres:tu_password@localhost:5432/ethereal_steps
   ```

**Opción B: Usar Neon (Recomendado - Gratis)**

1. Ve a: https://neon.tech
2. Crea una cuenta gratis
3. Crea un nuevo proyecto
4. Copia el `DATABASE_URL` que te proporcionen

### 3️⃣ Configurar Variables de Entorno

1. Copia `.env.example` a `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edita `.env` y completa:
   ```env
   # Base de Datos
   DATABASE_URL="postgresql://..."  # Pega tu URL aquí

   # NextAuth (genera un secreto)
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET=""  # Lo generamos en el siguiente paso

   # Stripe (por ahora déjalos vacíos, los configuramos después)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
   STRIPE_SECRET_KEY=""
   ```

3. Genera el `NEXTAUTH_SECRET`:
   ```bash
   # En Windows PowerShell:
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

   # O usa un generador online:
   # https://generate-secret.vercel.app/32
   ```

   Copia el resultado y pégalo en `NEXTAUTH_SECRET` en tu `.env`

### 4️⃣ Inicializar Base de Datos

Ejecuta estos comandos en orden:

```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear las tablas en la base de datos
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

✅ Si todo salió bien, verás un mensaje de éxito con los datos creados.

### 5️⃣ ¡Ejecutar el Proyecto!

```bash
npm run dev
```

Abre tu navegador en: **http://localhost:3000**

🎉 ¡Deberías ver tu tienda funcionando!

---

## 📝 Credenciales de Prueba

Después de ejecutar el seed, puedes usar:

**Administrador:**
- Email: `admin@etherealsteps.com`
- Password: `12345678`

**Cliente:**
- Email: `maria@example.com`
- Password: `12345678`

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Base de Datos
npm run db:studio        # Abrir Prisma Studio (interfaz visual)
npm run db:generate      # Regenerar cliente de Prisma
npm run db:push          # Actualizar schema sin migraciones
npm run db:migrate       # Crear migración
npm run db:seed          # Poblar con datos de ejemplo

# Producción
npm run build            # Compilar para producción
npm start                # Iniciar en modo producción
```

---

## 📋 Lista de Tareas Semanales

### **Semana 1 (18-24 Nov) - Fundamentos [40%]**

- [x] Configuración inicial del proyecto
- [x] Diseño con colores pasteles elegantes
- [x] Estructura de base de datos (Prisma)
- [x] Componentes UI base (Button, Input, Card)
- [ ] **Sistema de autenticación (NextAuth)**
  - [ ] Página de registro
  - [ ] Página de login
  - [ ] Protección de rutas
  - [ ] Perfil de usuario
- [ ] **Catálogo de productos**
  - [ ] Página de lista de productos
  - [ ] Página de detalle de producto
  - [ ] Filtros por categoría
  - [ ] Búsqueda de productos

### **Semana 2 (25 Nov - 1 Dic) - Core Features [50%]**

- [ ] **Panel de Administración**
  - [ ] CRUD de productos
  - [ ] Gestión de categorías
  - [ ] Gestión de inventario (variantes)
  - [ ] Subida de imágenes
- [ ] **Carrito de Compras**
  - [ ] Añadir/quitar productos
  - [ ] Actualizar cantidades
  - [ ] Persistencia con Zustand
  - [ ] Total y subtotales
- [ ] **Proceso de Checkout**
  - [ ] Página de checkout
  - [ ] Selección de dirección
  - [ ] Resumen de orden
- [ ] **Integración con Stripe**
  - [ ] Configurar cuenta de Stripe (modo test)
  - [ ] Proceso de pago
  - [ ] Webhooks para confirmación
- [ ] **Sistema de Comprobantes**
  - [ ] Generación de boletas (PDF)
  - [ ] Generación de facturas (PDF)
  - [ ] Envío por email

### **Semana 3 (2-8 Dic) - Finalización [10%]**

- [ ] **Testing y Depuración**
  - [ ] Probar flujo completo de compra
  - [ ] Corregir bugs encontrados
  - [ ] Validar todos los formularios
- [ ] **Optimizaciones**
  - [ ] Optimizar imágenes
  - [ ] Mejorar SEO
  - [ ] Performance (Lighthouse)
- [ ] **Deploy a Producción**
  - [ ] Configurar dominio
  - [ ] Deploy en Vercel
  - [ ] Configurar base de datos en Neon
  - [ ] SSL automático (incluido en Vercel)
- [ ] **Documentación**
  - [ ] Manual de usuario
  - [ ] Manual de administrador
  - [ ] Presentación final

---

## 🎨 Paleta de Colores

Tu proyecto usa esta elegante paleta:

- **Fondo Oscuro Principal**: `#1a1a2e`
- **Fondo Oscuro Secundario**: `#16213e`
- **Rosa Pastel**: `#FFB5D8` (primario)
- **Lavanda**: `#D4C5E8` (secundario)
- **Menta**: `#C5E8DB` (acento)

Úsalas en Tailwind como: `bg-dark-primary`, `text-pastel-rose`, etc.

---

## 🆘 Solución de Problemas

### Error: "Can't connect to database"
- Verifica que PostgreSQL esté corriendo
- Verifica que el `DATABASE_URL` en `.env` sea correcto

### Error: "Prisma Client not generated"
```bash
npm run db:generate
```

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### El servidor no inicia
```bash
# Mata el proceso en el puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [número] /F
```

---

## 📚 Recursos Útiles

- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Stripe Docs**: https://stripe.com/docs
- **React Icons**: https://lucide.dev

---

## 💡 Consejos

1. **Commits frecuentes**: Haz commits pequeños y frecuentes en Git
2. **Testing continuo**: Prueba cada feature que implementes
3. **Mobile First**: Diseña pensando en móviles primero
4. **Consulta ejemplos**: Busca e-commerce similares para inspiración

---

## 🚀 ¿Qué Hacer Ahora?

1. ✅ Completa la configuración (pasos 1-5 arriba)
2. 🔍 Explora el código en `app/page.tsx` y `components/`
3. 🎨 Personaliza los estilos en `app/globals.css`
4. 📝 Comienza con las tareas de la Semana 1

**¡Mucho éxito con tu proyecto! 💪**

Si tienes dudas, consulta el `README.md` completo.
