const express = require('express')
const CustomerGroupDiscountController = require('../controllers/customer-group-discount.controller')
const CustomerGroupDiscountValidate = require('../validations/customer-group-discount.validation')
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const PERMISSIONS = require('../../../constants/permission')

const router = express.Router()

router.get(
  '/customer-group-discount/shows',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_VIEW]),
  CustomerGroupDiscountController.getDiscounts
)

router.get(
  '/customer-group-discount/show/:id',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_VIEW]),
  CustomerGroupDiscountValidate.getById,
  validate,
  CustomerGroupDiscountController.getDiscountById
)

router.post(
  '/customer-group-discount/create',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_CREATE]),
  CustomerGroupDiscountValidate.create,
  validate,
  CustomerGroupDiscountController.createDiscount
)

router.put(
  '/customer-group-discount/update/:id',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_UPDATE]),
  CustomerGroupDiscountValidate.update,
  validate,
  CustomerGroupDiscountController.updateDiscount
)

router.delete(
  '/customer-group-discount/destroy/:id',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_DELETE]),
  CustomerGroupDiscountValidate.deleteById,
  validate,
  CustomerGroupDiscountController.deleteDiscount
)

module.exports = router
