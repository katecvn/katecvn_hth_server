const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const ProductService = require('../services/product.service')

const createProduct = async (req, res, next) => {
  const { id } = req.user
  const data = req.body
  try {
    const result = await ProductService.createProduct({ ...data, creator: id })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getProducts = async (req, res, next) => {
  try {
    const result = await ProductService.getProducts(req.query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getPublicProducts = async (req, res, next) => {
  try {
    const result = await ProductService.getPublicProducts(req.query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getVariants = async (req, res, next) => {
  try {
    const result = await ProductService.getVariants(req.query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  try {
    const result = await ProductService.getProductById(req.params.id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getProductBySlug = async (req, res, next) => {
  try {
    const result = await ProductService.getProductBySlug(req.params.slug)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const updateProductStatus = async (req, res, next) => {
  try {
    const result = await ProductService.updateProductStatus(req.params.id, req.body)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  const { id } = req.params
  const { id: updater } = req.user
  try {
    const result = await ProductService.updateProduct(id, { ...req.body, updater })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const result = await ProductService.deleteProduct(req.params.id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const sendProductToBCCU = async (req, res, next) => {
  try {
    const result = await ProductService.sendProductToBCCU({ id: req.params.id, isVariant: false })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const sendProductVariantToBCCU = async (req, res, next) => {
  try {
    const result = await ProductService.sendProductToBCCU({ id: req.params.id, isVariant: true })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getProductsByCustomer = async (req, res, next) => {
  try {
    const result = await ProductService.getProductsByCustomer(req.params.customerId)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getProductPriceHistoryByCustomer = async (req, res, next) => {
  try {
    const { customerId, productId } = req.params
    const result = await ProductService.getProductPriceHistoryByCustomer(customerId, productId)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createProduct,
  getProducts,
  getPublicProducts,
  getVariants,
  getProductById,
  getProductBySlug,
  updateProductStatus,
  updateProduct,
  deleteProduct,
  sendProductToBCCU,
  sendProductVariantToBCCU,
  getProductsByCustomer,
  getProductPriceHistoryByCustomer
}
