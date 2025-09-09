const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const express = require('express')
const { updateProductVariant } = require('../validations/product.variant.validation')
const ProductVariantController = require('../controllers/product.variant.controller')

const router = express.Router()

router.put('/product/variant/update/:id', authenticate, authorize([]), updateProductVariant, validate, ProductVariantController.updateProductVariant)
router.delete('/product/variant/destroy/:id', authenticate, authorize([]), ProductVariantController.deleteProductVariant)

module.exports = router
