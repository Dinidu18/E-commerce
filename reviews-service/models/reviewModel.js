const { v4: uuidv4 } = require('uuid');

let reviews = [
  {
    id: uuidv4(),
    productId: 'PROD-001',
    customerId: 'CUST-001',
    customerName: 'Alice Johnson',
    rating: 5,
    title: 'Exceptional noise cancellation!',
    body: 'These headphones are worth every penny. The noise cancellation is superb and the sound quality is crystal clear.',
    isVerifiedPurchase: true,
    helpfulVotes: 24,
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    productId: 'PROD-002',
    customerId: 'CUST-003',
    customerName: 'Carlos Rivera',
    rating: 4,
    title: 'Great running shoes, slightly narrow',
    body: 'Very comfortable and lightweight. I knocked off a star because they run a bit narrow for wide feet.',
    isVerifiedPurchase: true,
    helpfulVotes: 11,
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ReviewModel = {
  findAll: () => reviews,

  findById: (id) => reviews.find((r) => r.id === id),

  findByProduct: (productId) => reviews.filter((r) => r.productId === productId),

  findByCustomer: (customerId) => reviews.filter((r) => r.customerId === customerId),

  getAverageRating: (productId) => {
    const productReviews = reviews.filter((r) => r.productId === productId);
    if (!productReviews.length) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / productReviews.length).toFixed(1));
  },

  create: (data) => {
    const review = {
      id: uuidv4(),
      productId: data.productId,
      customerId: data.customerId,
      customerName: data.customerName || 'Anonymous',
      rating: Math.min(5, Math.max(1, parseInt(data.rating, 10))), // clamp 1–5
      title: data.title,
      body: data.body || '',
      isVerifiedPurchase: Boolean(data.isVerifiedPurchase) || false,
      helpfulVotes: 0,
      images: data.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reviews.push(review);
    return review;
  },

  update: (id, data) => {
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) return null;
    reviews[index] = { ...reviews[index], ...data, id, updatedAt: new Date().toISOString() };
    return reviews[index];
  },

  delete: (id) => {
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) return null;
    const [deleted] = reviews.splice(index, 1);
    return deleted;
  },
};

module.exports = ReviewModel;
