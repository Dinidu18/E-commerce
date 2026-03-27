const express = require('express');
const router = express.Router();
const {
  getAllPromotions, getPromotionById, validateCode, createPromotion, updatePromotion, deletePromotion, getHealth
} = require('../controllers/promotionController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Promotion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         code:
 *           type: string
 *           example: "SAVE20"
 *         title:
 *           type: string
 *           example: "20% Off Sitewide"
 *         description:
 *           type: string
 *         discountType:
 *           type: string
 *           enum: [percentage, fixed, free_shipping, buy_x_get_y]
 *           example: "percentage"
 *         discountValue:
 *           type: number
 *           example: 20
 *         minOrderAmount:
 *           type: number
 *           example: 50
 *         maxDiscountAmount:
 *           type: number
 *           example: 100
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 *         usageLimit:
 *           type: integer
 *           example: 1000
 *         usageCount:
 *           type: integer
 *           example: 245
 *         applicableCategories:
 *           type: array
 *           items:
 *             type: string
 *           example: ["all"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PromotionInput:
 *       type: object
 *       required:
 *         - title
 *         - discountValue
 *       properties:
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         discountType:
 *           type: string
 *           enum: [percentage, fixed, free_shipping, buy_x_get_y]
 *         discountValue:
 *           type: number
 *         minOrderAmount:
 *           type: number
 *         maxDiscountAmount:
 *           type: number
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 *         usageLimit:
 *           type: integer
 *         applicableCategories:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotions]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active/inactive
 *       - in: query
 *         name: discountType
 *         schema:
 *           type: string
 *           enum: [percentage, fixed, free_shipping, buy_x_get_y]
 *     responses:
 *       200:
 *         description: List of promotions
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
 *                     $ref: '#/components/schemas/Promotion'
 */
router.get('/', getAllPromotions);

/**
 * @swagger
 * /api/promotions/validate:
 *   post:
 *     summary: Validate a promotion code
 *     description: Check if a discount code is valid and applicable for a given order amount.
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SAVE20"
 *               orderAmount:
 *                 type: number
 *                 example: 120.00
 *     responses:
 *       200:
 *         description: Code is valid
 *       400:
 *         description: Code expired, limit reached, or minimum order not met
 *       404:
 *         description: Code not found or inactive
 */
router.post('/validate', validateCode);

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Get a promotion by ID
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion details
 *       404:
 *         description: Not found
 */
router.get('/:id', getPromotionById);

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromotionInput'
 *           example:
 *             code: "SUMMER30"
 *             title: "Summer Sale 30% Off"
 *             discountType: "percentage"
 *             discountValue: 30
 *             minOrderAmount: 60
 *             endDate: "2025-08-31T23:59:59.000Z"
 *             usageLimit: 500
 *     responses:
 *       201:
 *         description: Promotion created
 *       400:
 *         description: Validation error
 */
router.post('/', createPromotion);

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Update a promotion
 *     tags: [Promotions]
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
 *             $ref: '#/components/schemas/PromotionInput'
 *     responses:
 *       200:
 *         description: Promotion updated
 *       404:
 *         description: Not found
 */
router.put('/:id', updatePromotion);

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Delete a promotion
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion deleted
 *       404:
 *         description: Not found
 */
/**
 * @swagger
 * /api/promotions/health:
 *   get:
 *     summary: Service health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (req, res) => res.status(200).json({ status: 'OK', message: 'Service is healthy' }));

module.exports = router;
