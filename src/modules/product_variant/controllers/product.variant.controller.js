const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const ProductVariantService = require('../services/product.variant.service')

const updateProductVariant = async (req, res, next) => {
  const data = req.body
  const { id } = req.params

  try {
    const result = await ProductVariantService.updateProductVariant(id, data)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const deleteProductVariant = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await ProductVariantService.deleteProductVariant(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  updateProductVariant,
  deleteProductVariant
}
