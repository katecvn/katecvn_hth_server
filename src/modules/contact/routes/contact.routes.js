const express = require('express')
const ContactController = require('../controllers/contact.controller')
const ContactValidate = require('../validations/contact.validation')
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const PERMISSIONS = require('../../../constants/permission')
const { CreateLimiter } = require('../../../utils/CreateLimiter')
const router = express.Router()

router.get('/contact/shows', authenticate, authorize([PERMISSIONS.CONTACT_VIEW]), ContactController.getContacts)
router.get('/contact/show/:id', authenticate, authorize([PERMISSIONS.CONTACT_VIEW]), ContactController.getContactById)
router.post('/contact/create', CreateLimiter({ max: 5 }), ContactValidate.create, validate, ContactController.createContact)
router.put(
  '/contact/update-status/:id',
  authenticate,
  authorize([PERMISSIONS.CONTACT_MANAGE_STATUS]),
  ContactValidate.updateStatus,
  validate,
  ContactController.updateStatus
)
router.delete(
  '/contact/destroy/:id',
  authenticate,
  authorize([PERMISSIONS.CONTACT]),
  ContactValidate.deleteById,
  validate,
  ContactController.deleteById
)

module.exports = router
