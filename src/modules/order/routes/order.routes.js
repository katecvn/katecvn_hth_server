const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const OrderController = require('../controllers/order.controller')
const OrderValidate = require('../validations/order.validation')
const PaymentController = require('../controllers/payment.controller')
const PaymentValidate = require('../validations/payment.validation')
const ShippingController = require('../controllers/shipping.controller')
const ShippingValidate = require('../validations/shipping.validation')
const PERMISSIONS = require('../../../constants/permission')

// Order routes
router.get('/order/shows', authenticate, authorize(), OrderValidate.rangeDate, validate, OrderController.getOrdersByDate)
router.get('/order/:id', authenticate, authorize([]), OrderController.getOrderDetail)
router.get('/order/shows/customer', authenticate, OrderValidate.rangeDate, validate, OrderController.getOrdersByCustomer)
router.post('/order/create', OrderValidate.create, validate, OrderController.createOrder)
router.post('/order/assign-to-user', authenticate, authorize([]), OrderValidate.assignToUser, validate, OrderController.assignOrderTo)
router.put(
  '/order/update-status/:id',
  authenticate,
  authorize([PERMISSIONS.ORDER_MANAGE_STATUS]),
  OrderValidate.updateStatus,
  validate,
  OrderController.updateOrderStatusById
)
router.put(
  '/order/update-payment-status/:id',
  authenticate,
  authorize([PERMISSIONS.ORDER_MANAGE_STATUS]),
  OrderValidate.updatePaymentStatus,
  validate,
  OrderController.updatePaymentStatusById
)
router.delete('/order/destroy/:id', authenticate, authorize([PERMISSIONS.ORDER_DELETE]), OrderController.deleteOrderById)
// Payment routes
router.post(
  '/payment/create',
  authenticate,
  authorize([PERMISSIONS.PAYMENT_CREATE]),
  PaymentValidate.create,
  validate,
  PaymentController.createPayment
)
router.put(
  '/payment/update-status/:id',
  authenticate,
  authorize([PERMISSIONS.PAYMENT_MANAGE_STATUS]),
  PaymentValidate.updateStatus,
  validate,
  PaymentController.updatePaymentStatusById
)
router.delete(
  '/payment/destroy/:id',
  authenticate,
  authorize([PERMISSIONS.PAYMENT_DELETE]),
  PaymentValidate.deleteById,
  validate,
  PaymentController.deletePaymentById
)
// Shipping routes
router.post(
  '/shipping/create',
  authenticate,
  authorize([PERMISSIONS.SHIPPING_CREATE]),
  ShippingValidate.create,
  validate,
  ShippingController.createShipping
)
router.put(
  '/shipping/update-status/:id',
  authenticate,
  authorize([PERMISSIONS.SHIPPING_MANAGE_STATUS]),
  ShippingValidate.updateStatus,
  validate,
  ShippingController.updateShippingStatusById
)
router.put(
  '/shipping/update/:id',
  authenticate,
  authorize([PERMISSIONS.SHIPPING_UPDATE]),
  ShippingValidate.update,
  validate,
  ShippingController.updateShipping
)
router.delete(
  '/shipping/destroy/:id',
  authenticate,
  authorize([PERMISSIONS.SHIPPING_DELETE]),
  ShippingValidate.deleteById,
  validate,
  ShippingController.deleteShippingById
)

router.get(
  '/order-purchase-summary',
  authenticate,
  // authorize([PERMISSIONS.ORDER_VIEW]),
  OrderValidate.rangeDate,
  validate,
  OrderController.getPurchaseSummary
)


module.exports = router
