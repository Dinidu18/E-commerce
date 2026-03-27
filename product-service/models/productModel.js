/**
 * Product Model – in-memory data store
 * Simulates a database layer. Replace with Mongoose/Sequelize for a real DB.
 */

const { v4: uuidv4 } = require('uuid');

// ─── Seed Data ───────────────────────────────────────────────────────────────
let products = [
  {
    id: uuidv4(),
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with 40-hour battery life and active noise cancellation.',
    price: 149.99,
    category: 'Electronics',
    stock: 75,
    sku: 'ELEC-WH-001',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Running Shoes – UltraBoost',
    description: 'Lightweight, breathable running shoes suitable for all terrains.',
    price: 89.99,
    category: 'Footwear',
    stock: 200,
    sku: 'FOOT-RS-002',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated 1L water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 29.99,
    category: 'Kitchen',
    stock: 500,
    sku: 'KTCH-WB-003',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ─── CRUD Operations ──────────────────────────────────────────────────────────

const ProductModel = {
  /**
   * @returns {Array} All products
   */
  findAll: () => products,

  /**
   * @param {string} id - Product UUID
   * @returns {Object|undefined}
   */
  findById: (id) => products.find((p) => p.id === id),

  /**
   * @param {Object} data - Product fields
   * @returns {Object} Newly created product
   */
  create: (data) => {
    const product = {
      id: uuidv4(),
      name: data.name,
      description: data.description || '',
      price: parseFloat(data.price),
      category: data.category || 'Uncategorized',
      stock: parseInt(data.stock, 10) || 0,
      sku: data.sku || `SKU-${Date.now()}`,
      imageUrl: data.imageUrl || '',
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(product);
    return product;
  },

  /**
   * @param {string} id - Product UUID
   * @param {Object} data - Fields to update
   * @returns {Object|null} Updated product or null if not found
   */
  update: (id, data) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...data,
      id,                                  // prevent ID overwrite
      updatedAt: new Date().toISOString(),
    };
    return products[index];
  },

  /**
   * @param {string} id - Product UUID
   * @returns {Object|null} Deleted product or null if not found
   */
  delete: (id) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const [deleted] = products.splice(index, 1);
    return deleted;
  },
};

module.exports = ProductModel;
