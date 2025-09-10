const express = require('express')
const CustomerGroupDiscountHistoryController = require('../controllers/customer-group-discount-history.controller')
const CustomerGroupDiscountHistoryValidate = require('../validations/customer-group-discount-history.validation')
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const PERMISSIONS = require('../../../constants/permission')

const router = express.Router()

router.get(
  '/customer-group-discount-history/shows',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_HISTORY_VIEW]),
  CustomerGroupDiscountHistoryValidate.getHistories,
  validate,
  CustomerGroupDiscountHistoryController.getHistories
)

router.get(
  '/customer-group-discount-history/show/:id',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_HISTORY_VIEW]),
  CustomerGroupDiscountHistoryValidate.getById,
  validate,
  CustomerGroupDiscountHistoryController.getHistoryById
)

module.exports = router
