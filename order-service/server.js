const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5002;
const SERVICE_NAME = 'Order Management Service';

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Management API',
      version: '1.0.0',
      description: 'REST API for managing customer orders in the E-commerce system.',
      contact: { name: 'E-Commerce Dev Team', email: 'dev@ecommerce.com' },
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Local Development Server' },
      { url: 'http://localhost:8080/orders', description: 'Via API Gateway' },
    ],
    tags: [
      { name: 'Orders', description: 'Order management endpoints' },
      { name: 'Health', description: 'Service health check' },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: '📋 Orders - API Documentation',
  customCss: `
    :root { --bg-dark: #0f0f1e; --text-primary: #f5f5f7; --text-secondary: #a0a0a6; --accent: #7ee787; --border-color: rgba(255, 255, 255, 0.08); }
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
    .swagger-ui .btn:hover { background: #5fd66a; }
    .swagger-ui .model-box { background: rgba(26, 26, 46, 0.6); border: 1px solid var(--border-color); }
    .swagger-ui table.model { background: transparent; }
    .swagger-ui .tab { color: var(--text-secondary); }
    .swagger-ui .tab.active { color: var(--accent); border-bottom: 2px solid var(--accent); }
    .swagger-ui input, .swagger-ui select, .swagger-ui textarea { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 6px; }
    .swagger-ui input:focus, .swagger-ui select:focus, .swagger-ui textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(126, 231, 135, 0.1); }
  `,
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.originalUrl}`, hint: 'Try GET /api/orders or visit /api-docs' });
});

app.use((err, req, res, next) => {
  console.error(`[${SERVICE_NAME}] Error:`, err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n✅  ${SERVICE_NAME} running on http://localhost:${PORT}`);
  console.log(`📚  Swagger UI → http://localhost:${PORT}/api-docs\n`);
});

module.exports = app;
