const router = require('express').Router();
const { userExtractor } = require('../utils/middleware');
const { User, Message } = require('../models');

router.get('/', userExtractor, async (req, res) => {
  const user = req.user;
  const messages = await Message.findAll({
    where: {
      receiverId: user.userId
    },
    include: [{
      model: User,
      as: 'Sender',
      attributes: ['username']
    }]
  });
  res.json(messages);
})

router.post('/', userExtractor, async (req, res) => {
  const user = req.user;
  const { receiverId, content } = req.body;
  const message = await Message.create({
    senderId: user.userId,
    receiverId,
    content
  });
  res.status(201).json(message);
})

module.exports = router;