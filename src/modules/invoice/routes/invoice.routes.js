const express = require('express')
const InvoiceController = require('../controllers/invoice.controller')
const InvoiceValidate = require('../validations/invoice.validation')
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const PERMISSIONS = require('../../../constants/permission')

const router = express.Router()

router.get(
  '/invoice/shows',
  authenticate,
  authorize([PERMISSIONS.INVOICE_VIEW]),
  InvoiceController.getInvoices
)

router.get(
  '/invoice/show/:id',
  authenticate,
  authorize([PERMISSIONS.INVOICE_VIEW]),
  InvoiceController.getInvoiceById
)

router.post(
  '/invoice/create',
  authenticate,
  authorize([PERMISSIONS.INVOICE_CREATE]),
  InvoiceValidate.create,
  validate,
  InvoiceController.createInvoice
)

router.put(
  '/invoice/update/:id',
  authenticate,
  authorize([PERMISSIONS.INVOICE_UPDATE]),
  InvoiceValidate.update,
  validate,
  InvoiceController.updateInvoice
)

router.put(
  '/invoice/update-status/:id',
  authenticate,
  authorize([PERMISSIONS.INVOICE_MANAGE_STATUS]),
  InvoiceValidate.updateStatus,
  validate,
  InvoiceController.updateStatus
)

router.delete(
  '/invoice/destroy/:id',
  authenticate,
  authorize([PERMISSIONS.INVOICE_DELETE]),
  InvoiceValidate.deleteById,
  validate,
  InvoiceController.deleteById
)

module.exports = router
