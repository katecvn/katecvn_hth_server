const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const ProductsController = require('../controllers/products.controller')
const ProductsValidation = require('../validations/products.validation')
const ProductGroupsController = require('../../product/controllers/productGroups.controller')
const ProductGroupsValidation = require('../validations/productGroups.validation')
const ProductOptionsController = require('../../product/controllers/productOptions.controller')
const ProductOptionsValidation = require('../../product/validations/productOptions.validation')
const CategoryController = require('../controllers/category.controller')
const CategoryValidation = require('../validations/category.validation')
// Products routes
router.post('/create', authenticate, authorize(), ProductsValidation.create, validate, ProductsController.create)
router.get('/shows', authenticate, authorize(), ProductsController.findAll)
router.get('/show/:id', authenticate, authorize(), ProductsValidation.show, validate, ProductsController.findOne)
router.put('/update/:id', authenticate, authorize(), ProductsValidation.update, validate, ProductsController.update)
router.delete('/destroy/:id', authenticate, authorize(), ProductsController.remove)

// Product Groups routes

// Product Options routes

// Public routes
router.get('/public/shows', ProductsController.findAll)
router.get('/public/show/:id', ProductsValidation.show, validate, ProductsController.findOne)

router.get('/category/shows', authenticate, authorize(), CategoryController.getAll)
router.get('/category/shows-tree', authenticate, authorize(), CategoryController.getAllWithHierarchy)
router.get('/category/show/:id', authenticate, authorize(), CategoryValidation.show, validate, CategoryController.getById)
router.post('/category/create', authenticate, authorize(), CategoryValidation.create, validate, CategoryController.create)
router.put('/category/update/:id', authenticate, authorize(), CategoryValidation.update, validate, CategoryController.update)
router.delete('/category/destroy/:id', authenticate, authorize(), CategoryValidation.destroy, validate, CategoryController.remove)

router.get('/category/public/shows', CategoryController.getAll)
router.get('/category/public/shows-tree', CategoryController.getAllWithHierarchy)

module.exports = router
