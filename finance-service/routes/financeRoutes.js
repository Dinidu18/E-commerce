const express = require('express');
const router = express.Router();
const {
  getAllTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction,
} = require('../controllers/financeController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         orderId:
 *           type: string
 *           example: "ORD-001"
 *         customerId:
 *           type: string
 *           example: "CUST-001"
 *         amount:
 *           type: number
 *           example: 209.97
 *         type:
 *           type: string
 *           enum: [payment, refund, chargeback, adjustment]
 *           example: "payment"
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *           example: "completed"
 *         paymentMethod:
 *           type: string
 *           example: "credit_card"
 *         currency:
 *           type: string
 *           example: "USD"
 *         description:
 *           type: string
 *           example: "Payment for Order ORD-001"
 *         referenceNumber:
 *           type: string
 *           example: "TXN-1711500000000"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     TransactionInput:
 *       type: object
 *       required:
 *         - orderId
 *         - customerId
 *         - amount
 *       properties:
 *         orderId:
 *           type: string
 *         customerId:
 *           type: string
 *         amount:
 *           type: number
 *         type:
 *           type: string
 *           enum: [payment, refund, chargeback, adjustment]
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *         paymentMethod:
 *           type: string
 *         currency:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Retrieve all transactions
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [payment, refund, chargeback, adjustment]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 */
router.get('/', getAllTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Not found
 */
router.get('/:id', getTransactionById);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *           example:
 *             orderId: "ORD-003"
 *             customerId: "CUST-003"
 *             amount: 149.99
 *             type: "payment"
 *             paymentMethod: "credit_card"
 *             currency: "USD"
 *             description: "Payment for Order ORD-003"
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Validation error
 */
router.post('/', createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             status: "completed"
 *     responses:
 *       200:
 *         description: Transaction updated
 *       404:
 *         description: Not found
 */
router.put('/:id', updateTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       404:
 *         description: Not found
 */
/**
 * @swagger
 * /api/transactions/health:
 *   get:
 *     summary: Service health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (req, res) => res.status(200).json({ status: 'OK', message: 'Service is healthy' }));

module.exports = router;
