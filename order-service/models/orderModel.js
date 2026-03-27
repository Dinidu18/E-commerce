const { v4: uuidv4 } = require('uuid');

let orders = [
  {
    id: uuidv4(),
    customerId: 'CUST-001',
    items: [
      { productId: 'PROD-001', productName: 'Wireless Headphones', quantity: 1, unitPrice: 149.99 },
      { productId: 'PROD-003', productName: 'Water Bottle', quantity: 2, unitPrice: 29.99 },
    ],
    totalAmount: 209.97,
    status: 'delivered',
    shippingAddress: {
      fullName: 'Alice Johnson',
      street: '123 Maple Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    paymentMethod: 'credit_card',
    notes: 'Leave at front door',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customerId: 'CUST-002',
    items: [
      { productId: 'PROD-002', productName: 'Running Shoes', quantity: 1, unitPrice: 89.99 },
    ],
    totalAmount: 89.99,
    status: 'processing',
    shippingAddress: {
      fullName: 'Bob Smith',
      street: '456 Oak Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    paymentMethod: 'paypal',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const OrderModel = {
  findAll: () => orders,

  findById: (id) => orders.find((o) => o.id === id),

  findByCustomer: (customerId) => orders.filter((o) => o.customerId === customerId),

  create: (data) => {
    const totalAmount = data.totalAmount ||
      (data.items || []).reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const order = {
      id: uuidv4(),
      customerId: data.customerId,
      items: data.items || [],
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: data.status || 'pending',
      shippingAddress: data.shippingAddress || {},
      paymentMethod: data.paymentMethod || 'cash',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(order);
    return order;
  },

  update: (id, data) => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    return orders[index];
  },

  delete: (id) => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    const [deleted] = orders.splice(index, 1);
    return deleted;
  },

  ORDER_STATUSES,
};

module.exports = OrderModel;
