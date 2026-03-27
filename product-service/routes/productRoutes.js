/**
 * Product Routes – routes/productRoutes.js
 *
 * All routes include JSDoc Swagger annotations consumed by swagger-jsdoc.
 * This file is the TEMPLATE for all other service route files.
 */

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getHealth,
} = require('../controllers/productController');

// ═══════════════════════════════════════════════════════════════════════════════
// SWAGGER COMPONENT SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           example: "Wireless Headphones"
 *         description:
 *           type: string
 *           example: "Premium noise-cancelling headphones"
 *         price:
 *           type: number
 *           format: float
 *           example: 149.99
 *         category:
 *           type: string
 *           example: "Electronics"
 *         stock:
 *           type: integer
 *           example: 75
 *         sku:
 *           type: string
 *           example: "ELEC-WH-001"
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/headphones.jpg"
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           example: "Wireless Headphones"
 *         description:
 *           type: string
 *           example: "Premium noise-cancelling headphones"
 *         price:
 *           type: number
 *           example: 149.99
 *         category:
 *           type: string
 *           example: "Electronics"
 *         stock:
 *           type: integer
 *           example: 75
 *         sku:
 *           type: string
 *           example: "ELEC-WH-001"
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/headphones.jpg"
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     SuccessListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: integer
 *           example: 3
 *         data:
 *           type: array
 *           items: {}
 *
 *     SuccessSingleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Resource not found"
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all products
 *     description: Returns a list of all products. Supports optional query filters.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by exact category name (case-insensitive)
 *         example: "Electronics"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *         example: 20
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *         example: 200
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Pass true to only return in-stock products
 *         example: true
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search on name and description
 *         example: "headphones"
 *     responses:
 *       200:
 *         description: Successful response with list of products
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessListResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product UUID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: "Smart Watch Pro"
 *             description: "GPS smartwatch with health tracking"
 *             price: 199.99
 *             category: "Electronics"
 *             stock: 50
 *             sku: "ELEC-SW-004"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product created successfully."
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error – missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Partial updates are supported – only include the fields you want to change.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             stock: 45
 *             price: 179.99
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessSingleResponse'
 *       400:
 *         description: Empty request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product UUID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessSingleResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/products/health:
 *   get:
 *     summary: Service health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "UP"
 *                 service:
 *                   type: string
 *                   example: "Product Management Service"
 */
router.get('/health', (req, res) => res.status(200).json({ status: 'OK', message: 'Service is healthy' }));

module.exports = router;
