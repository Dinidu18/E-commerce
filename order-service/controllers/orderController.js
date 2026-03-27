const OrderModel = require('../models/orderModel');

// GET /api/orders
const getAllOrders = (req, res) => {
  try {
    const { status, customerId } = req.query;
    let orders = OrderModel.findAll();

    if (status) orders = orders.filter((o) => o.status === status);
    if (customerId) orders = orders.filter((o) => o.customerId === customerId);

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = (req, res) => {
  try {
    const order = OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/orders
const createOrder = (req, res) => {
  try {
    const { customerId, items } = req.body;
    if (!customerId) {
      return res.status(400).json({ success: false, message: '"customerId" is required.' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: '"items" must be a non-empty array.' });
    }
    const order = OrderModel.create(req.body);
    res.status(201).json({ success: true, message: 'Order created successfully.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id
const updateOrder = (req, res) => {
  try {
    if (req.body.status && !OrderModel.ORDER_STATUSES.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${OrderModel.ORDER_STATUSES.join(', ')}`,
      });
    }
    const order = OrderModel.update(req.params.id, req.body);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, message: 'Order updated successfully.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/orders/:id
const deleteOrder = (req, res) => {
  try {
    const order = OrderModel.delete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, message: 'Order deleted successfully.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };
