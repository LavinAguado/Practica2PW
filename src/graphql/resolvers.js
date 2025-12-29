const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Helpers
const requireAuth = (context) => {
  if (!context.user) {
    throw new Error('No autenticado');
  }
};

const requireAdmin = (context) => {
  if (!context.user || context.user.role !== 'admin') {
    throw new Error('No autorizado');
  }
};

const resolvers = {
  // ================== QUERIES ==================
  Query: {
  products: async () => Product.find(),

  // ADMIN
  orders: async (_, __, context) => {
    if (!context.user || context.user.role !== 'admin') {
      throw new Error('No autorizado');
    }

    return Order.find()
      .populate('user')
      .populate('products.product')
      .sort({ createdAt: -1 });
  },

  ordersByStatus: async (_, { status }, context) => {
    if (!context.user || context.user.role !== 'admin') {
      throw new Error('No autorizado');
    }

    return Order.find({ status })
      .populate('user')
      .populate('products.product')
      .sort({ createdAt: -1 });
  },

  // USUARIO NORMAL
  myOrders: async (_, __, context) => {
    if (!context.user) {
      throw new Error('No autenticado');
    }

    return Order.find({ user: context.user.id })
      .populate('products.product')
      .sort({ createdAt: -1 });
  }
},


  // ================== MUTATIONS ==================
  Mutation: {
    // -------- PRODUCTS --------
    createProduct: async (_, { title, price, stock }) => {
      const product = new Product({ title, price, stock });
      return product.save();
    },

    updateProduct: async (_, { id, title, price, stock }, context) => {
      requireAdmin(context);

      return Product.findByIdAndUpdate(
        id,
        { title, price, stock },
        { new: true }
      );
    },

    deleteProduct: async (_, { id }, context) => {
      requireAdmin(context);
      await Product.findByIdAndDelete(id);
      return true;
    },

    // -------- ORDERS --------
    createOrder: async (_, { items }, context) => {
      requireAuth(context);

      let total = 0;
      const orderProducts = [];

      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error('Producto no encontrado');

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${product.title}`);
        }

        product.stock -= item.quantity;
        await product.save();

        total += product.price * item.quantity;

        orderProducts.push({
          product: product._id,
          quantity: item.quantity
        });
      }

      const order = new Order({
        user: context.user.id,
        products: orderProducts,
        total,
        status: 'PENDING'
      });

      return order.save();
    },

    updateOrderStatus: async (_, { id, status }, context) => {
      requireAdmin(context);

      const order = await Order.findById(id);
      if (!order) throw new Error('Pedido no encontrado');

      order.status = status;
      await order.save();

      return order;
    },

    // -------- USERS (CRUD ADMIN) --------
    createUser: async (_, { username, email, password, role }, context) => {
      requireAdmin(context);

      const exists = await User.findOne({ email });
      if (exists) throw new Error('El usuario ya existe');

      const user = new User({
        username,
        email,
        password,
        role: role || 'user'
      });

      return user.save();
    },

    updateUser: async (_, { id, username, email, role }, context) => {
      requireAdmin(context);

      return User.findByIdAndUpdate(
        id,
        { username, email, role },
        { new: true }
      );
    },

    deleteUser: async (_, { id }, context) => {
      requireAdmin(context);

      await User.findByIdAndDelete(id);
      return true;
    }
  }
};

module.exports = resolvers;
