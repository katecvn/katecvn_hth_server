const { param } = require('express-validator')
const { message } = require('../../../constants/message')
const ProductVariantService = require('../services/productVariant.service')

const show = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .bail()
    .custom(async (id) => {
      const productVariant = await ProductVariantService.getProductVariantById({ id })

      if (!productVariant) throw new Error('Product variant not found')

      return true
    })
]

const showMany = []

module.exports = {
  show,
  showMany
}
