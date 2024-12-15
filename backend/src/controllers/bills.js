const router = require('express').Router();
const { userExtractor } = require('../utils/middleware');

router.get('/', userExtractor, async(req, res) => {
  const user = req.user
  const bills = await user.getBills({
    order: [['createdAt', 'DESC']]
  })
  res.json(bills)
})

module.exports = router
