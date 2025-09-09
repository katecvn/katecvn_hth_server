const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const express = require('express')
const AttributeValidate = require('../validations/attribute.validation')
const AttributeController = require('../controllers/attribute.controller')
const router = express.Router()

router.get('/attribute/shows', authenticate, authorize([]), AttributeController.getAttributes)
router.post('/attribute/create', authenticate, authorize([]), AttributeValidate.createAttribute, validate, AttributeController.createAttribute)
router.put('/attribute/update/:id', authenticate, authorize([]), AttributeValidate.updateAttribute, validate, AttributeController.updateAttribute)
router.get('/attribute/show/:id', authenticate, authorize([]), AttributeController.getAttributeById)
router.delete('/attribute/destroy/:id', authenticate, authorize([]), AttributeController.deleteAttribute)

module.exports = router
