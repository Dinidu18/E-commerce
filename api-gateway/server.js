/**
 * API Gateway - server.js
 * Port: 8080
 *
 * Routes all incoming requests to the appropriate microservice
 * using http-proxy-middleware.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

// ─────────────────────────────────────────────
// Service Registry
// ─────────────────────────────────────────────
const SERVICES = {
  products: {
    url: 'http://localhost:5001',
    pathRewrite: { '^/products': '/api/products' },
    description: 'Product Management Service',
  },
  orders: {
    url: 'http://localhost:5002',
    pathRewrite: { '^/orders': '/api/orders' },
    description: 'Order Management Service',
  },
  finance: {
    url: 'http://localhost:5003',
    pathRewrite: { '^/finance': '/api/transactions' },
    description: 'Finance Management Service',
  },
  marketing: {
    url: 'http://localhost:5004',
    pathRewrite: { '^/marketing': '/api/promotions' },
    description: 'Marketing & Promotion Service',
  },
  support: {
    url: 'http://localhost:5005',
    pathRewrite: { '^/support': '/api/tickets' },
    description: 'Customer Support Service',
  },
  reviews: {
    url: 'http://localhost:5006',
    pathRewrite: { '^/reviews': '/api/reviews' },
    description: 'Reviews & Ratings Service',
  },
};

// ─────────────────────────────────────────────
// Global Middleware
// ─────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public')); // Serve the modern dashboard

// Rate limiting – 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// ─────────────────────────────────────────────
// Gateway Dashboard
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    service: 'API Gateway',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// Proxy Routes
// ─────────────────────────────────────────────

/**
 * Helper to build a proxy middleware with consistent options.
 */
function buildProxy(target, pathRewrite, serviceName) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    on: {
      error: (err, req, res) => {
        console.error(`[Gateway] Proxy error for ${serviceName}:`, err.message);
        res.status(502).json({
          success: false,
          message: `${serviceName} is currently unavailable. Please try again later.`,
          error: err.message,
        });
      },
      proxyReq: (proxyReq, req) => {
        console.log(`[Gateway] → ${req.method} ${req.url} → ${target}`);
      },
    },
  });
}

// Mount each service proxy
app.use('/products', buildProxy(SERVICES.products.url, SERVICES.products.pathRewrite, 'Product Service'));
app.use('/orders',   buildProxy(SERVICES.orders.url,   SERVICES.orders.pathRewrite,   'Order Service'));
app.use('/finance',  buildProxy(SERVICES.finance.url,  SERVICES.finance.pathRewrite,  'Finance Service'));
app.use('/marketing',buildProxy(SERVICES.marketing.url,SERVICES.marketing.pathRewrite,'Marketing Service'));
app.use('/support',  buildProxy(SERVICES.support.url,  SERVICES.support.pathRewrite,  'Customer Support Service'));
app.use('/reviews',  buildProxy(SERVICES.reviews.url,  SERVICES.reviews.pathRewrite,  'Reviews Service'));

// ─────────────────────────────────────────────
// 404 – Unknown Route
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found on the gateway.`,
    availableRoutes: Object.keys(SERVICES).map((k) => `/${k}`),
  });
});

// ─────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n══════════════════════════════════════════════');
  console.log(`  🚀  API Gateway running on http://localhost:${PORT}`);
  console.log('══════════════════════════════════════════════');
  Object.entries(SERVICES).forEach(([key, svc]) => {
    console.log(`  ↳  /${key.padEnd(12)} → ${svc.url}  (${svc.description})`);
  });
  console.log('══════════════════════════════════════════════\n');
});

module.exports = app;
