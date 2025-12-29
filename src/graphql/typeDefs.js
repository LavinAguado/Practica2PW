const typeDefs = `
  type Product {
    id: ID!
    title: String!
    price: Float!
    stock: Int!
  }

  type OrderProduct {
    product: Product!
    quantity: Int!
  }

  type Order {
   id: ID!
   user: User!
   products: [OrderProduct!]!
   total: Float!
   status: String!
   createdAt: String!
  }
   type User {
   id: ID!
    username: String!
    email: String!
    role: String!
  }



  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  type Query {
    products: [Product!]!
    orders: [Order!]!
  }
  
  type Query {
  orders: [Order!]!
  ordersByStatus(status: String!): [Order!]!
  }


  type Mutation {
    createProduct(title: String!, price: Float!, stock: Int!): Product
    createOrder(items: [OrderItemInput!]!, userId: ID): Order
  }
  type Mutation {
   updateOrderStatus(id: ID!, status: String!): Order!
  }
   type Query {
  users: [User!]!
}

type Mutation {
  deleteUser(id: ID!): Boolean!
  changeUserRole(id: ID!, role: String!): User!
}
type Query {
  users: [User!]!
}

type Mutation {
  deleteUser(id: ID!): Boolean!
  changeUserRole(id: ID!, role: String!): User!
}

type Query {
  products: [Product]
  orders: [Order]              # admin
  ordersByStatus(status: String!): [Order] # admin
  myOrders: [Order]            # usuario normal
}

Query {
  myOrders: [Order]
}


`;

module.exports = typeDefs;
