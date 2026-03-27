const TransactionModel = require('../models/transactionModel');

// GET /api/transactions
const getAllTransactions = (req, res) => {
  try {
    const { type, status, customerId, orderId } = req.query;
    let txns = TransactionModel.findAll();

    if (type) txns = txns.filter((t) => t.type === type);
    if (status) txns = txns.filter((t) => t.status === status);
    if (customerId) txns = txns.filter((t) => t.customerId === customerId);
    if (orderId) txns = txns.filter((t) => t.orderId === orderId);

    res.status(200).json({ success: true, count: txns.length, data: txns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/transactions/:id
const getTransactionById = (req, res) => {
  try {
    const txn = TransactionModel.findById(req.params.id);
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.status(200).json({ success: true, data: txn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/transactions
const createTransaction = (req, res) => {
  try {
    const { orderId, customerId, amount } = req.body;
    if (!orderId || !customerId || amount === undefined) {
      return res.status(400).json({ success: false, message: '"orderId", "customerId", and "amount" are required.' });
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, message: '"amount" must be a positive number.' });
    }
    const txn = TransactionModel.create(req.body);
    res.status(201).json({ success: true, message: 'Transaction created successfully.', data: txn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/transactions/:id
const updateTransaction = (req, res) => {
  try {
    if (req.body.status && !TransactionModel.TRANSACTION_STATUSES.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${TransactionModel.TRANSACTION_STATUSES.join(', ')}`,
      });
    }
    const txn = TransactionModel.update(req.params.id, req.body);
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.status(200).json({ success: true, message: 'Transaction updated successfully.', data: txn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = (req, res) => {
  try {
    const txn = TransactionModel.delete(req.params.id);
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.status(200).json({ success: true, message: 'Transaction deleted successfully.', data: txn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Health Check Controller
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    service: 'Finance Management Service',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getAllTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction, getHealth };
