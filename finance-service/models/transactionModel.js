const { v4: uuidv4 } = require('uuid');

let transactions = [
  {
    id: uuidv4(),
    orderId: 'ORD-001',
    customerId: 'CUST-001',
    amount: 209.97,
    type: 'payment',
    status: 'completed',
    paymentMethod: 'credit_card',
    currency: 'USD',
    description: 'Payment for Order ORD-001',
    referenceNumber: `TXN-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    orderId: 'ORD-002',
    customerId: 'CUST-002',
    amount: 89.99,
    type: 'payment',
    status: 'pending',
    paymentMethod: 'paypal',
    currency: 'USD',
    description: 'Payment for Order ORD-002',
    referenceNumber: `TXN-${Date.now() + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const TRANSACTION_TYPES = ['payment', 'refund', 'chargeback', 'adjustment'];
const TRANSACTION_STATUSES = ['pending', 'completed', 'failed', 'cancelled'];

const TransactionModel = {
  findAll: () => transactions,

  findById: (id) => transactions.find((t) => t.id === id),

  findByOrder: (orderId) => transactions.filter((t) => t.orderId === orderId),

  findByCustomer: (customerId) => transactions.filter((t) => t.customerId === customerId),

  create: (data) => {
    const transaction = {
      id: uuidv4(),
      orderId: data.orderId,
      customerId: data.customerId,
      amount: parseFloat(data.amount),
      type: data.type || 'payment',
      status: data.status || 'pending',
      paymentMethod: data.paymentMethod || 'cash',
      currency: data.currency || 'USD',
      description: data.description || '',
      referenceNumber: data.referenceNumber || `TXN-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    transactions.push(transaction);
    return transaction;
  },

  update: (id, data) => {
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;
    transactions[index] = { ...transactions[index], ...data, id, updatedAt: new Date().toISOString() };
    return transactions[index];
  },

  delete: (id) => {
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const [deleted] = transactions.splice(index, 1);
    return deleted;
  },

  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,
};

module.exports = TransactionModel;
