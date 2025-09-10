const express = require('express')
const CustomerGroupController = require('../controllers/customer-group.controller')
const CustomerGroupValidate = require('../validations/customer-group.validation')
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const PERMISSIONS = require('../../../constants/permission')

const router = express.Router()

router.get(
  '/customer-group/shows',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_VIEW]),
  CustomerGroupController.getCustomerGroups
)

router.get(
  '/customer-group/show/:id',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_VIEW]),
  CustomerGroupValidate.getById,
  validate,
  CustomerGroupController.getCustomerGroupById
)

router.post(
  '/customer-group/create',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_CREATE]),
  CustomerGroupValidate.create,
  validate,
  CustomerGroupController.createCustomerGroup
)

router.put(
  '/customer-group/update/:id',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_UPDATE]),
  CustomerGroupValidate.update,
  validate,
  CustomerGroupController.updateCustomerGroup
)

router.delete(
  '/customer-group/destroy/:id',
  authenticate,
  authorize([PERMISSIONS.CUSTOMER_GROUP_DELETE]),
  CustomerGroupValidate.deleteById,
  validate,
  CustomerGroupController.deleteCustomerGroup
)

module.exports = router
