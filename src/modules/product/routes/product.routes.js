const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const CategoryController = require('../controllers/category.controller')
const BrandController = require('../controllers/brand.controller')
const CategoryValidation = require('../validations/category.validation')
const BrandValidation = require('../validations/brand.validation')
const ReviewController = require('../controllers/review.controller')
const ProductGroupsValidation = require('../validations/productGroups.validation')
const ProductGroupsController = require('../controllers/productGroups.controller')
const ProductOptionsValidation = require('../validations/productOptions.validation')
const ProductOptionsController = require('../controllers/productOptions.controller')
const ProductValidate = require('../validations/product.validation')
const ProductController = require('../controllers/product.controller')

const { validate } = require('../../../middlewares/Validate')
const ReviewValidate = require('../validations/review.validation')
const SupplierController = require('../controllers/supplier.controller')
const SupplierValidate = require('../validations/supplier.validation')
const ReceiptController = require('../controllers/inventoryReceipt.controller')
const ReceiptValidate = require('../validations/inventory.receipt.validation')

router.post('/product/create', authenticate, authorize([]), ProductValidate.createProduct, validate, ProductController.createProduct)
router.get('/product/shows', authenticate, authorize([]), ProductController.getProducts)
router.get('/product/variant/shows', authenticate, authorize([]), ProductController.getVariants)
router.get('/product/show/:id', authenticate, authorize([]), ProductController.getProductById)
router.put(
  '/product/update-status/:id',
  authenticate,
  authorize([]),
  ProductValidate.updateProductStatus,
  validate,
  ProductController.updateProductStatus
)
router.put('/product/update/:id', authenticate, authorize([]), ProductValidate.updateProduct, validate, ProductController.updateProduct)
router.delete('/product/destroy/:id', authenticate, authorize([]), ProductController.deleteProduct)
// Send BCCU routes
router.get('/product/send-bccu/:id', authenticate, authorize([]), ProductController.sendProductToBCCU)
router.get('/product/variant/send-bccu/:id', authenticate, authorize([]), ProductController.sendProductVariantToBCCU)

// public routes
router.get('/product/public/show-by-slug/:slug', ProductController.getProductBySlug)
router.get('/product/public/shows', ProductController.getPublicProducts)

router.get('/category/shows', authenticate, authorize(), CategoryController.getAll)
router.get('/category/shows-tree', authenticate, authorize(), CategoryController.getAllWithHierarchy)
router.get('/category/show/:id', authenticate, authorize(), CategoryValidation.show, validate, CategoryController.getById)
router.post('/category/create', authenticate, authorize(), CategoryValidation.create, validate, CategoryController.create)
router.put('/category/update/:id', authenticate, authorize(), CategoryValidation.update, validate, CategoryController.update)
router.delete('/category/destroy/:id', authenticate, authorize(), CategoryValidation.destroy, validate, CategoryController.remove)
router.get('/category/public/shows', CategoryController.getAll)
router.get('/category/public/shows-tree', CategoryController.getAllWithHierarchy)
router.get('/category/public/show/:slug', CategoryController.getBySlug)

router.post('/brand/create', authenticate, authorize(), BrandValidation.create, validate, BrandController.create)
router.get('/brand/shows', authenticate, authorize(), BrandController.getAll)
router.get('/brand/show/:id', authenticate, authorize(), BrandValidation.show, validate, BrandController.getById)
router.put('/brand/update/:id', authenticate, authorize(), BrandValidation.update, validate, BrandController.update)
router.delete('/brand/destroy/:id', authenticate, authorize(), BrandValidation.destroy, validate, BrandController.remove)
router.get('/public/brand/shows', BrandController.getAll)

// Review Routes
router.get('/review/:provider/shows', authenticate, authorize([]), ReviewController.getAllReviews)
router.get('/review/:provider/public/shows', ReviewController.getPublicReviews)
router.get('/review/:provider/show/:id', authenticate, authorize([]), ReviewController.getReviewById)
router.post('/review/:provider/create', authenticate, ReviewValidate.create, validate, ReviewController.createReview)
router.put('/review/update-status/:id', authenticate, authorize([]), ReviewValidate.updateStatus, validate, ReviewController.updateStatus)
router.delete('/review/destroy/:id', authenticate, authorize([]), ReviewValidate.destroy, validate, ReviewController.deleteReview)

router.post('/product-group/create', authenticate, authorize(), ProductGroupsValidation.create, validate, ProductGroupsController.create)
router.get('/product-group/shows', authenticate, authorize(), ProductGroupsValidation.shows, validate, ProductGroupsController.findAll)
router.get('/product-group/show/:id', authenticate, authorize(), ProductGroupsValidation.show, validate, ProductGroupsController.findOne)
router.put('/product-group/update/:id', authenticate, authorize(), ProductGroupsValidation.update, validate, ProductGroupsController.update)
router.delete('/product-group/destroy/:id', authenticate, authorize(), ProductGroupsValidation.remove, validate, ProductGroupsController.remove)
router.get('/product-group/public/shows', ProductGroupsController.findAll)

router.post('/product-option/create', authenticate, authorize(), ProductOptionsValidation.create, validate, ProductOptionsController.create)
router.get('/product-option/shows', authenticate, authorize(), ProductOptionsValidation.shows, validate, ProductOptionsController.findAll)
router.get('/product-option/show/:id', authenticate, authorize(), ProductOptionsValidation.show, validate, ProductOptionsController.findOne)
router.put('/product-option/update/:id', authenticate, authorize(), ProductOptionsValidation.update, validate, ProductOptionsController.update)
router.delete('/product-option/destroy/:id', authenticate, authorize(), ProductOptionsValidation.remove, validate, ProductOptionsController.remove)

router.get('/supplier/shows', authenticate, authorize([]), SupplierController.getAllSuppliers)
router.get('/supplier/show/:id', authenticate, authorize([]), SupplierController.getSupplierById)
router.post('/supplier/create', authenticate, authorize([]), SupplierValidate.create, validate, SupplierController.createSupplier)
router.put('/supplier/update/:id', authenticate, authorize([]), SupplierValidate.update, validate, SupplierController.updateSupplier)
router.delete('/supplier/destroy/:id', authenticate, authorize([]), SupplierValidate.destroy, validate, SupplierController.deleteSupplier)

router.post('/receipt/create', authenticate, authorize([]), ReceiptController.createReceipt)
router.get('/receipt/shows', authenticate, authorize([]), ReceiptController.getAllReceipts)
router.get('/receipt/show/:id', authenticate, authorize([]), ReceiptController.getReceiptById)
router.put('/receipt/update/:id', authenticate, authorize([]), ReceiptController.updateReceipt)
router.delete('/receipt/destroy/:id', authenticate, authorize([]), ReceiptController.deleteReceipt)
router.put('/receipt/update-status/:id', authenticate, authorize([]), ReceiptValidate.updateStatus, validate, ReceiptController.updateReceiptStatus)

router.get('/product/by-customer/:customerId', authenticate, authorize([]), ProductController.getProductsByCustomer)
router.get('/product/history/:customerId/:productId', authenticate, authorize([]), ProductController.getProductPriceHistoryByCustomer)


module.exports = router
