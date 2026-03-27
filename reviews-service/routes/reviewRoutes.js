const express = require('express');
const router = express.Router();
const {
  getAllReviews, getReviewById, getProductSummary, createReview, updateReview, deleteReview, getHealth
} = require('../controllers/reviewController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           example: "PROD-001"
 *         customerId:
 *           type: string
 *           example: "CUST-001"
 *         customerName:
 *           type: string
 *           example: "Alice Johnson"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         title:
 *           type: string
 *           example: "Exceptional noise cancellation!"
 *         body:
 *           type: string
 *           example: "These headphones are worth every penny."
 *         isVerifiedPurchase:
 *           type: boolean
 *           example: true
 *         helpfulVotes:
 *           type: integer
 *           example: 24
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ReviewInput:
 *       type: object
 *       required:
 *         - productId
 *         - customerId
 *         - rating
 *         - title
 *       properties:
 *         productId:
 *           type: string
 *         customerId:
 *           type: string
 *         customerName:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         isVerifiedPurchase:
 *           type: boolean
 *
 *     ProductReviewSummary:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         totalReviews:
 *           type: integer
 *         averageRating:
 *           type: number
 *         ratingDistribution:
 *           type: object
 *           properties:
 *             "1":
 *               type: integer
 *             "2":
 *               type: integer
 *             "3":
 *               type: integer
 *             "4":
 *               type: integer
 *             "5":
 *               type: integer
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *     responses:
 *       200:
 *         description: List of reviews
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
 *                     $ref: '#/components/schemas/Review'
 */
router.get('/', getAllReviews);

/**
 * @swagger
 * /api/reviews/product/{productId}/summary:
 *   get:
 *     summary: Get aggregated review summary for a product
 *     description: Returns total review count, average rating, and rating distribution.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: "PROD-001"
 *     responses:
 *       200:
 *         description: Product review summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ProductReviewSummary'
 */
router.get('/product/:productId/summary', getProductSummary);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 */
router.get('/:id', getReviewById);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Submit a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *           example:
 *             productId: "PROD-003"
 *             customerId: "CUST-005"
 *             customerName: "Sophie Chen"
 *             rating: 4
 *             title: "Very durable bottle"
 *             body: "Keeps my drinks cold all day. Slightly heavy but well worth it."
 *             isVerifiedPurchase: true
 *     responses:
 *       201:
 *         description: Review submitted
 *       400:
 *         description: Validation error
 */
router.post('/', createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
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
 *             rating: 5
 *             title: "Updated: Absolutely love it!"
 *     responses:
 *       200:
 *         description: Review updated
 *       400:
 *         description: Invalid rating
 *       404:
 *         description: Review not found
 */
router.put('/:id', updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       404:
 *         description: Review not found
 */
router.delete('/:id', deleteReview);

/**
 * @swagger
 * /api/reviews/health:
 *   get:
 *     summary: Service health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (req, res) => res.status(200).json({ status: 'OK', message: 'Service is healthy' }));

module.exports = router;
