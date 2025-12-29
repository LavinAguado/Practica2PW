# Práctica 1 / 2 – Portal de Productos con Pedidos y Roles

## 📌 Resumen
Aplicación web full‑stack que implementa un portal de productos con autenticación, carrito de compra y gestión de pedidos, cumpliendo los requisitos de la práctica.

Funcionalidades principales:
- Registro y login con JWT.
- Roles de usuario: `user` y `admin`.
- CRUD de productos (solo admin).
- Carrito de compra con persistencia en `localStorage`.
- Creación de pedidos con control de stock.
- Asociación de pedidos a usuarios.
- Vista **Mis pedidos** para usuarios.
- Vista **Gestión de pedidos** para administradores.
- CRUD de usuarios (admin).
- API GraphQL para pedidos.
- Persistencia en MongoDB.

---

## 🛠️ Tecnologías
- **Backend**
  - Node.js
  - Express
  - MongoDB + Mongoose
  - JWT (`jsonwebtoken`)
  - GraphQL (Apollo Server)

- **Frontend**
  - HTML
  - CSS
  - JavaScript Vanilla

---

## ⚙️ Requisitos
- Node.js >= 16
- MongoDB en local o MongoDB Atlas

---

## 🚀 Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>


## Instalación
1. Clona el repositorio.
2. `npm install`
3. Copia `.env.example` a `.env` y configura `MONGO_URI` y `JWT_SECRET`.
4. `npm run dev` (o `npm start`)

## Endpoints principales
- `POST /api/auth/register` body: `{ username, email, password, role }`
- `POST /api/auth/login` body: `{ email, password }`
- `GET /api/products` (autenticado)
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

## Chat
- Accede a `/chat.html` tras iniciar sesión.
- Cliente Socket.IO envía token en handshake: `{ auth: { token } }`.

📦 Productos (CRUD)
👑 Admin

    Crear productos.

    Editar productos.

    Eliminar productos.

    Ver stock actualizado en tiempo real.

👤 Usuario

    Ver listado de productos.

    Seleccionar cantidad antes de añadir al carrito.

🛒 Carrito de compra

    Añadir productos con cantidad seleccionada.

    Incrementar o reducir cantidades directamente desde el listado de productos.

    Persistencia del carrito usando localStorage.

    Cálculo automático del importe total.

    Vaciado automático del carrito tras realizar un pedido correctamente.

📑 Pedidos
🧾 Creación de pedidos

    El pedido se realiza desde el carrito.

    Control de stock en backend.

    El stock se descuenta al confirmar el pedido.

    El pedido queda asociado al usuario autenticado.

🔄 Estados del pedido

    PENDING

    PAID

    CANCELLED (según implementación)

👤 Vista "Mis pedidos" (Usuarios)

    Muestra únicamente los pedidos del usuario autenticado.

    Información mostrada:

        Productos

        Cantidades

        Total del pedido

        Estado

        Fecha de creación

🛠️ Vista Admin de pedidos

    Listado completo de todos los pedidos.

    Filtro por estado del pedido.

    Información detallada:

        Usuario

        Productos

        Total

        Estado

    Posibilidad de actualizar el estado del pedido.

👥 Gestión de usuarios (Admin)

    Listar usuarios.

    Crear usuarios.

    Editar usuarios.

    Eliminar usuarios.

    Cambio de rol (user / admin).

🔗 GraphQL
📌 Queries principales

    orders → Obtener todos los pedidos (solo admin).

    ordersByStatus(status) → Pedidos filtrados por estado (solo admin).

    myOrders → Pedidos del usuario autenticado.

✏️ Mutations principales

    createOrder(items)

    updateOrderStatus(id, status)

    CRUD completo de usuarios (solo admin).
## Notas y decisiones
- Se ha mantenido el almacenamiento del chat en memoria (no persistente) para la versión básica — ampliación opcional: persistir mensajes en MongoDB.
- Se permite asignar `admin` en registro (para pruebas). En un contexto real, la creación de admins debe estar controlada.
- Interfaz minimalista: se puede mejorar con frameworks o subida de imágenes.

## Evaluación
- Autenticación JWT: implementada.
- Roles: implementados y comprobados en rutas.
- CRUD: operativo, usa Mongoose.
- Chat: funcional con Socket.IO y token de autenticación.
