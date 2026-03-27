/**
 * Product Management Service – server.js
 * Port: 5001
 *
 * This file serves as the TEMPLATE for all microservices.
 * To replicate for another service:
 *   1. Change PORT, serviceName, and api-docs customSiteTitle
 *   2. Change the route import & mount path
 *   3. Update swagger info.title & description
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const SERVICE_NAME = 'Product Management Service';

// ─────────────────────────────────────────────
// Core Middleware
// ─────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// Swagger / OpenAPI Configuration
// ─────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Management API',
      version: '1.0.0',
      description:
        'REST API for managing products in the E-commerce microservices system. ' +
        'Supports full CRUD operations with filtering capabilities.',
      contact: {
        name: 'E-Commerce Dev Team',
        email: 'dev@ecommerce.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local Development Server',
      },
      {
        url: `http://localhost:8080/products`,
        description: 'Via API Gateway',
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Health',
        description: 'Service health check',
      },
    ],
  },
  // Scan all route files for JSDoc Swagger annotations
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Modern Design Theme for Swagger (matching dashboard)
const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: '📦 Products - API Documentation',
  customCss: `
    :root { --bg-dark: #0f0f1e; --text-primary: #f5f5f7; --text-secondary: #a0a0a6; --accent: #58a6ff; --border-color: rgba(255, 255, 255, 0.08); }
    body { background-color: var(--bg-dark); color: var(--text-primary); font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .swagger-ui { background-color: var(--bg-dark); }
    .topbar { background-color: rgba(26, 26, 46, 0.8); border-bottom: 1px solid var(--border-color); }
    .topbar-wrapper a { color: var(--text-primary); }
    .swagger-ui .info .title { color: var(--accent); font-size: 1.5rem; font-weight: 700; }
    .swagger-ui .info .description { color: var(--text-secondary); }
    .swagger-ui .scheme-container { background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border-color); border-radius: 10px; }
    .swagger-ui .opblock { background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border-color); border-radius: 10px; margin-bottom: 1rem; }
    .swagger-ui .opblock.opblock-get { border-left: 4px solid #34c759; }
    .swagger-ui .opblock.opblock-post { border-left: 4px solid var(--accent); }
    .swagger-ui .opblock.opblock-put { border-left: 4px solid #ffa657; }
    .swagger-ui .opblock.opblock-delete { border-left: 4px solid #ff7b72; }
    .swagger-ui .btn { background: var(--accent); color: white; border: none; border-radius: 8px; font-weight: 600; }
    .swagger-ui .btn:hover { background: #388bfd; }
    .swagger-ui .model-box { background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border-color); }
    .swagger-ui table.model { background: transparent; }
    .swagger-ui .tab { color: var(--text-secondary); }
    .swagger-ui .tab.active { color: var(--accent); border-bottom: 2px solid var(--accent); }
    .swagger-ui input, .swagger-ui select, .swagger-ui textarea { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 6px; }
    .swagger-ui input:focus, .swagger-ui select:focus, .swagger-ui textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1); }
  `,
};

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use('/api/products', productRoutes);

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Service health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is running
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
 *                   example: UP
 *                 service:
 *                   type: string
 *                   example: Product Management Service
 *                 port:
 *                   type: integer
 *                   example: 5001
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    service: SERVICE_NAME,
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// Root Info Endpoint
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: SERVICE_NAME,
    port: PORT,
    timestamp: new Date().toISOString(),
    endpoints: {
      docs:    `http://localhost:${PORT}/api-docs`,
      health:  `http://localhost:${PORT}/health`,
      api:     `http://localhost:${PORT}/api/products`,
      gateway: 'http://localhost:8080/products',
    },
  });
});

// ─────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    hint: `Try GET /api/products or visit /api-docs`,
  });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[${SERVICE_NAME}] Error:`, err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  ${SERVICE_NAME} running on http://localhost:${PORT}`);
  console.log(`📚  Swagger UI → http://localhost:${PORT}/api-docs\n`);
});

module.exports = app;
