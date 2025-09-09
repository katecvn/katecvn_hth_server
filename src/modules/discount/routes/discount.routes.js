const express = require('express')
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const router = express.Router()
const DiscountController = require('../controllers/discount.controller')
const DiscountValidate = require('../validations/discount.validation')
const { validate } = require('../../../middlewares/Validate')
const PERMISSIONS = require('../../../constants/permission')

router.get('/discount/shows', authenticate, authorize([PERMISSIONS.DISCOUNT_VIEW]), DiscountValidate.rangeDate, validate, DiscountController.getDiscounts)
router.get('/discount/show/:id', authenticate, authorize([PERMISSIONS.DISCOUNT_DETAIL]), DiscountController.getDiscountById)
router.post('/discount/create', authenticate, authorize([PERMISSIONS.DISCOUNT_CREATE]), DiscountValidate.create, validate, DiscountController.createDiscount)
router.post('/discount/apply', DiscountValidate.applyDiscount, validate, DiscountController.applyDiscount)
router.put('/discount/update/:id', authenticate, authorize([PERMISSIONS.DISCOUNT_UPDATE]), DiscountValidate.update, validate, DiscountController.updateDiscountById)
router.put('/discount/update-status/:id', authenticate, authorize([PERMISSIONS.DISCOUNT_MANAGE_STATUS]), DiscountValidate.updateStatus, validate, DiscountController.updateStatus)
router.delete('/discount/destroy/:id', authenticate, authorize([PERMISSIONS.DISCOUNT_DELETE]), DiscountValidate.deleteById, validate, DiscountController.deleteById)

router.get('/discount-products/public/shows', DiscountController.getPublicDiscountProducts)
router.post('/available-discounts', DiscountController.getPublicDiscount)

module.exports = router
