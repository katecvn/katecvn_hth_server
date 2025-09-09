const express = require('express')
const router = express.Router()
const PageController = require('../controllers/PageController')
const PageValidate = require('../validates/PageValidate')
const { authorize, authenticate } = require('../middlewares/JWTAction')
const { validate } = require('../middlewares/Validate')

router.get('/shows', authenticate, authorize(), PageController.getAllPages)
router.get('/show/:id', authenticate, authorize(), PageValidate.show, validate, PageController.getPageById)
router.post('/create', authenticate, authorize(), PageValidate.create, validate, PageController.createPage)
router.put('/update/:id', authenticate, authorize(), PageValidate.update, validate, PageController.updatePage)
router.delete('/destroy/:id', authenticate, authorize(), PageValidate.destroy, validate, PageController.deletePage)

//API public
router.get('/public/show-by-slug/:slug', PageValidate.showBySlug, validate, PageController.showBySlug)

module.exports = router
