const router = require('express').Router();
const { Image } = require('../models')

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const image = await Image.findByPk(id)
  if (image) {
    res.contentType(image.mimeType)
    res.send(Buffer.from(image.data))
  } else {
    res.status(404).end()
  }
})

module.exports = router