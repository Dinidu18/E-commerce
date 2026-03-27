const ProductModel = require('../models/productModel');

// ─── GET /api/products ────────────────────────────────────────────────────────
const getAllProducts = (req, res) => {
  try {
    const { category, minPrice, maxPrice, inStock, search } = req.query;
    let products = ProductModel.findAll();

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (category) {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (minPrice) {
      products = products.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.price <= parseFloat(maxPrice));
    }
    if (inStock === 'true') {
      products = products.filter((p) => p.stock > 0);
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
const getProductById = (req, res) => {
  try {
    const product = ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/products ───────────────────────────────────────────────────────
const createProduct = (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: "name" and "price" are required fields.',
      });
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ success: false, message: '"price" must be a non-negative number.' });
    }

    const product = ProductModel.create(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully.', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/products/:id ────────────────────────────────────────────────────
const updateProduct = (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Request body cannot be empty.' });
    }
    const product = ProductModel.update(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product updated successfully.', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
const deleteProduct = (req, res) => {
  try {
    const product = ProductModel.delete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully.', data: product });
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
    service: 'Product Management Service',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getHealth };
