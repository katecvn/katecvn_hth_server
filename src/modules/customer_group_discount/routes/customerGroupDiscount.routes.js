const express = require('express')
const CustomerProductDiscountController = require('../controllers/customerGroupDiscount.controller')
const CustomerProductDiscountValidate = require('../validations/customerGroupDiscount.validation')
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const PERMISSIONS = require('../../../constants/permission')

const router = express.Router()

// Lấy sản phẩm kèm giảm giá theo group
router.get(
  '/customer-product-discount/products',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_VIEW]),
  CustomerProductDiscountValidate.getProductsByCustomerGroup,
  validate,
  CustomerProductDiscountController.getProductsByCustomerGroup
)

// Tạo giảm giá cho 1 sản phẩm
router.post(
  '/customer-product-discount/create',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_CREATE]),
  CustomerProductDiscountValidate.create,
  validate,
  CustomerProductDiscountController.createDiscount
)

// Update giảm giá cho 1 sản phẩm
router.put(
  '/customer-product-discount/update/:id',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_UPDATE]),
  CustomerProductDiscountValidate.update,
  validate,
  CustomerProductDiscountController.updateDiscount
)

// Xóa giảm giá (truyền customerGroupId và productId trong body)
router.delete(
  '/customer-product-discount/destroy',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_DELETE]),
  CustomerProductDiscountValidate.deleteDiscount,
  validate,
  CustomerProductDiscountController.deleteDiscount
)

// Cập nhật hàng loạt discount cho group
router.post(
  '/customer-product-discount/bulk-update',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DISCOUNT_UPDATE]),
  CustomerProductDiscountValidate.bulkUpdate,
  validate,
  CustomerProductDiscountController.bulkUpdateDiscount
)

module.exports = router
