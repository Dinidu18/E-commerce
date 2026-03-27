const { v4: uuidv4 } = require('uuid');

let promotions = [
  {
    id: uuidv4(),
    code: 'SAVE20',
    title: '20% Off Sitewide',
    description: 'Get 20% off on all products for a limited time.',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 50,
    maxDiscountAmount: 100,
    startDate: '2025-01-01T00:00:00.000Z',
    endDate: '2025-12-31T23:59:59.000Z',
    isActive: true,
    usageLimit: 1000,
    usageCount: 245,
    applicableCategories: ['all'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    code: 'FLAT10',
    title: '$10 Off Your Order',
    description: 'Flat $10 discount on orders above $75.',
    discountType: 'fixed',
    discountValue: 10,
    minOrderAmount: 75,
    maxDiscountAmount: 10,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-06-30T23:59:59.000Z',
    isActive: true,
    usageLimit: 500,
    usageCount: 83,
    applicableCategories: ['Electronics', 'Footwear'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DISCOUNT_TYPES = ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y'];

const PromotionModel = {
  findAll: () => promotions,

  findById: (id) => promotions.find((p) => p.id === id),

  findByCode: (code) => promotions.find((p) => p.code.toUpperCase() === code.toUpperCase()),

  create: (data) => {
    const promotion = {
      id: uuidv4(),
      code: (data.code || `PROMO-${Date.now()}`).toUpperCase(),
      title: data.title,
      description: data.description || '',
      discountType: data.discountType || 'percentage',
      discountValue: parseFloat(data.discountValue),
      minOrderAmount: parseFloat(data.minOrderAmount) || 0,
      maxDiscountAmount: parseFloat(data.maxDiscountAmount) || null,
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      usageLimit: parseInt(data.usageLimit, 10) || null,
      usageCount: 0,
      applicableCategories: data.applicableCategories || ['all'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    promotions.push(promotion);
    return promotion;
  },

  update: (id, data) => {
    const index = promotions.findIndex((p) => p.id === id);
    if (index === -1) return null;
    promotions[index] = { ...promotions[index], ...data, id, updatedAt: new Date().toISOString() };
    return promotions[index];
  },

  delete: (id) => {
    const index = promotions.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const [deleted] = promotions.splice(index, 1);
    return deleted;
  },

  DISCOUNT_TYPES,
};

module.exports = PromotionModel;
