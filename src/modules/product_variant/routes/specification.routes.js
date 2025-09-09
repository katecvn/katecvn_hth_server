const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const express = require('express')
const SpecificationValidate = require('../validations/specification.validation')
const SpecificationController = require('../controllers/specification.controller')
const router = express.Router()

router.get('/specification/group/shows', authenticate, authorize([]), SpecificationController.getSpecificationGroups)
router.get('/specification/group/show/:id', authenticate, authorize([]), SpecificationController.getSpecificationGroupById)
router.post(
  '/specification/group/create',
  authenticate,
  authorize([]),
  SpecificationValidate.createSpecificationGroup,
  validate,
  SpecificationController.createSpecificationGroup
)
router.put(
  '/specification/group/update/:id',
  authenticate,
  authorize([]),
  SpecificationValidate.updateSpecificationGroup,
  validate,
  SpecificationController.updateSpecificationGroup
)
router.delete('/specification/group/destroy/:id', authenticate, authorize([]), SpecificationController.deleteSpecificationGroup)

router.get('/specification/shows', authenticate, authorize([]), SpecificationController.getSpecifications)
router.get('/specification/show/:id', authenticate, authorize([]), SpecificationController.getSpecificationById)
router.post(
  '/specification/create',
  authenticate,
  authorize([]),
  SpecificationValidate.createSpecification,
  validate,
  SpecificationController.createSpecification
)
router.put(
  '/specification/update/:id',
  authenticate,
  authorize([]),
  SpecificationValidate.updateSpecification,
  validate,
  SpecificationController.updateSpecification
)
router.delete('/specification/destroy/:id', authenticate, authorize([]), SpecificationController.deleteSpecification)

module.exports = router
