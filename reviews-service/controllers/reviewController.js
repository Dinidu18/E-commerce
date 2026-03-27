const ReviewModel = require('../models/reviewModel');

// GET /api/reviews
const getAllReviews = (req, res) => {
  try {
    const { productId, customerId, minRating, maxRating } = req.query;
    let reviews = ReviewModel.findAll();

    if (productId) reviews = reviews.filter((r) => r.productId === productId);
    if (customerId) reviews = reviews.filter((r) => r.customerId === customerId);
    if (minRating) reviews = reviews.filter((r) => r.rating >= parseInt(minRating, 10));
    if (maxRating) reviews = reviews.filter((r) => r.rating <= parseInt(maxRating, 10));

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reviews/:id
const getReviewById = (req, res) => {
  try {
    const review = ReviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reviews/product/:productId/summary
const getProductSummary = (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = ReviewModel.findByProduct(productId);
    const averageRating = ReviewModel.getAverageRating(productId);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => { distribution[r.rating]++; });

    res.status(200).json({
      success: true,
      data: {
        productId,
        totalReviews: reviews.length,
        averageRating,
        ratingDistribution: distribution,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/reviews
const createReview = (req, res) => {
  try {
    const { productId, customerId, rating, title } = req.body;
    if (!productId || !customerId || !rating || !title) {
      return res.status(400).json({ success: false, message: '"productId", "customerId", "rating", and "title" are required.' });
    }
    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: '"rating" must be an integer between 1 and 5.' });
    }
    const review = ReviewModel.create(req.body);
    res.status(201).json({ success: true, message: 'Review submitted successfully.', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/reviews/:id
const updateReview = (req, res) => {
  try {
    if (req.body.rating) {
      const r = parseInt(req.body.rating, 10);
      if (isNaN(r) || r < 1 || r > 5) {
        return res.status(400).json({ success: false, message: '"rating" must be between 1 and 5.' });
      }
    }
    const review = ReviewModel.update(req.params.id, req.body);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.status(200).json({ success: true, message: 'Review updated successfully.', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/reviews/:id
const deleteReview = (req, res) => {
  try {
    const review = ReviewModel.delete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.status(200).json({ success: true, message: 'Review deleted successfully.', data: review });
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
    service: 'Reviews & Ratings Service',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getAllReviews, getReviewById, getProductSummary, createReview, updateReview, deleteReview, getHealth };
