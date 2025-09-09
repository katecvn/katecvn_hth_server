const router = require('./routes/products.routes')
const ProductGroupsController = require('./controllers/productGroups.controller')
const ProductGroupsService = require('./services/productGroups.service')
const ProductGroupsValidation = require('./validations/productGroups.validation')

module.exports = {
  router,
  productGroups: {
    controller: ProductGroupsController,
    service: ProductGroupsService,
    validation: ProductGroupsValidation
  }
}
