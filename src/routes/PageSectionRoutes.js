const express = require('express')
const router = express.Router()
const PageSectionController = require('../controllers/PageSectionController')
const { authenticate, authorize } = require('../middlewares/JWTAction')
const PageSectionValidate = require('../validates/PageSectionValidate')
const { validate } = require('../middlewares/Validate')

router.get('/shows/', authenticate, authorize(), PageSectionValidate.shows, validate, PageSectionController.getAllPageSections)
router.get('/show/:id', authenticate, authorize(), PageSectionValidate.show, validate, PageSectionController.getPageSectionById)
router.post('/create/', authenticate, authorize(), PageSectionValidate.create, validate, PageSectionController.createPageSection)
router.put('/update/:id', authenticate, authorize(), PageSectionValidate.update, validate, PageSectionController.updatePageSection)
router.delete('/destroy/:id', authenticate, authorize(), PageSectionValidate.destroy, validate, PageSectionController.deletePageSection)

router.get('/public/shows', PageSectionValidate.shows, validate, PageSectionController.getAllPageSections)

module.exports = router
