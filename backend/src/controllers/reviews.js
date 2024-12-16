const router = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const { Review, Order } = require('../models')


router.post('/', userExtractor, async (req, res) => {
  const { content, rating, orderId } = req.body
  const reviewerId = req.user.userId
  const order = await Order.findOne({ where: { orderId } })
  if (!order) {
    return res.status(404).json({ error: 'Order not found' })
  }
  let type, reviewedId
  if (order.buyerId === reviewerId) {
    type = 'buyerToSeller'
    reviewedId = order.sellerId
  }
  else if (order.sellerId === reviewerId) {
    type = 'sellerToBuyer'
    reviewedId = order.buyerId
  } else {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  const existingReview = await Review.findOne({
    where: { reviewerId, reviewedId, orderId, type }
  });

  if (existingReview) {
    return res.status(429).json({ error: 'Review already exists' });
  }

  const review = await Review.create({ content, rating, reviewerId, reviewedId, type, orderId })
  res.status(201).json(review)
})

router.delete('/:reviewId', userExtractor, async (req, res) => {
  const reviewId = req.params.reviewId
  const reviewerId = req.user.userId

  const review = await Review.findOne({ where: { reviewId, reviewerId } })
  if (!review) {
    return res.status(404).json({ error: 'Review not found' })
  }

  await review.destroy()
  res.status(204).end()
})

module.exports = router
