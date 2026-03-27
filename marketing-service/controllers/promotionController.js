const PromotionModel = require('../models/promotionModel');

// GET /api/promotions
const getAllPromotions = (req, res) => {
  try {
    const { isActive, discountType } = req.query;
    let promos = PromotionModel.findAll();

    if (isActive !== undefined) {
      const active = isActive === 'true';
      promos = promos.filter((p) => p.isActive === active);
    }
    if (discountType) promos = promos.filter((p) => p.discountType === discountType);

    res.status(200).json({ success: true, count: promos.length, data: promos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/promotions/:id
const getPromotionById = (req, res) => {
  try {
    const promo = PromotionModel.findById(req.params.id);
    if (!promo) return res.status(404).json({ success: false, message: 'Promotion not found' });
    res.status(200).json({ success: true, data: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/promotions/validate  – check if a code is usable
const validateCode = (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) return res.status(400).json({ success: false, message: '"code" is required.' });

    const promo = PromotionModel.findByCode(code);
    if (!promo || !promo.isActive) {
      return res.status(404).json({ success: false, message: 'Promotion code is invalid or inactive.' });
    }
    const now = new Date();
    if (promo.endDate && new Date(promo.endDate) < now) {
      return res.status(400).json({ success: false, message: 'Promotion code has expired.' });
    }
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return res.status(400).json({ success: false, message: 'Promotion usage limit reached.' });
    }
    if (orderAmount && parseFloat(orderAmount) < promo.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of $${promo.minOrderAmount} not met.`,
      });
    }
    res.status(200).json({ success: true, message: 'Promotion code is valid.', data: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/promotions
const createPromotion = (req, res) => {
  try {
    const { title, discountValue } = req.body;
    if (!title || discountValue === undefined) {
      return res.status(400).json({ success: false, message: '"title" and "discountValue" are required.' });
    }
    const promo = PromotionModel.create(req.body);
    res.status(201).json({ success: true, message: 'Promotion created successfully.', data: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/promotions/:id
const updatePromotion = (req, res) => {
  try {
    const promo = PromotionModel.update(req.params.id, req.body);
    if (!promo) return res.status(404).json({ success: false, message: 'Promotion not found' });
    res.status(200).json({ success: true, message: 'Promotion updated successfully.', data: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/promotions/:id
const deletePromotion = (req, res) => {
  try {
    const promo = PromotionModel.delete(req.params.id);
    if (!promo) return res.status(404).json({ success: false, message: 'Promotion not found' });
    res.status(200).json({ success: true, message: 'Promotion deleted successfully.', data: promo });
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
    service: 'Marketing & Promotion Service',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getAllPromotions, getPromotionById, validateCode, createPromotion, updatePromotion, deletePromotion, getHealth };
