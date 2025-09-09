const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const ProductService = require('../services/product.service')

const createProduct = async (req, res, next) => {
  const { id } = req.user
  const data = req.body

  try {
    const result = await ProductService.createProduct({
      ...data,
      creator: id
    })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getProducts = async (req, res, next) => {
  const query = req.query

  try {
    const result = await ProductService.getProducts(query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getPublicProducts = async (req, res, next) => {
  const query = req.query

  try {
    const result = await ProductService.getPublicProducts(query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getVariants = async (req, res, next) => {
  const query = req.query

  try {
    const result = await ProductService.getVariants(query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await ProductService.getProductById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getProductBySlug = async (req, res, next) => {
  const { slug } = req.params

  try {
    const result = await ProductService.getProductBySlug(slug)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const updateProductStatus = async (req, res, next) => {
  const { id } = req.params
  const data = req.body

  try {
    const result = await ProductService.updateProductStatus(id, data)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  const { id } = req.params
  const data = req.body
  const { id: updater } = req.user

  try {
    const result = await ProductService.updateProduct(id, { ...data, updater })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await ProductService.deleteProduct(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const sendProductToBCCU = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await ProductService.sendProductToBCCU({ id, isVariant: false })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const sendProductVariantToBCCU = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await ProductService.sendProductToBCCU({ id, isVariant: true })
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
  sendProductVariantToBCCU
}
