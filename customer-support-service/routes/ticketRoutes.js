const express = require('express');
const router = express.Router();
const { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket, getHealth } = require('../controllers/ticketController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         customerId:
 *           type: string
 *           example: "CUST-001"
 *         orderId:
 *           type: string
 *           example: "ORD-001"
 *         subject:
 *           type: string
 *           example: "Item arrived damaged"
 *         description:
 *           type: string
 *           example: "The product packaging was crushed upon arrival."
 *         status:
 *           type: string
 *           enum: [open, in_progress, awaiting_customer, resolved, closed]
 *           example: "open"
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *           example: "high"
 *         category:
 *           type: string
 *           enum: [damaged_item, wrong_item, missing_item, refund_request, delivery_issue, general_inquiry, other]
 *         agentId:
 *           type: string
 *           nullable: true
 *           example: "AGENT-003"
 *         resolution:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     TicketInput:
 *       type: object
 *       required:
 *         - customerId
 *         - subject
 *         - description
 *       properties:
 *         customerId:
 *           type: string
 *         orderId:
 *           type: string
 *         subject:
 *           type: string
 *         description:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         category:
 *           type: string
 *           enum: [damaged_item, wrong_item, missing_item, refund_request, delivery_issue, general_inquiry, other]
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all support tickets
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, in_progress, awaiting_customer, resolved, closed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: string
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tickets
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
 *                     $ref: '#/components/schemas/Ticket'
 */
router.get('/', getAllTickets);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket details
 *       404:
 *         description: Ticket not found
 */
router.get('/:id', getTicketById);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new support ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketInput'
 *           example:
 *             customerId: "CUST-003"
 *             orderId: "ORD-003"
 *             subject: "Package not delivered"
 *             description: "My tracking shows delivered but I never received anything."
 *             priority: "high"
 *             category: "delivery_issue"
 *     responses:
 *       201:
 *         description: Ticket created
 *       400:
 *         description: Validation error
 */
router.post('/', createTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Update a ticket (e.g., assign agent, change status)
 *     tags: [Tickets]
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
 *             status: "in_progress"
 *             agentId: "AGENT-001"
 *     responses:
 *       200:
 *         description: Ticket updated
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Ticket not found
 */
router.put('/:id', updateTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Delete a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted
 *       404:
 *         description: Ticket not found
 */
router.delete('/:id', deleteTicket);

/**
 * @swagger
 * /api/tickets/health:
 *   get:
 *     summary: Service health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (req, res) => res.status(200).json({ status: 'OK', message: 'Service is healthy' }));

module.exports = router;
