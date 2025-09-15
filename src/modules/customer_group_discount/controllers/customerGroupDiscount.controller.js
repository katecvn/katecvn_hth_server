const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const CustomerProductDiscountService = require('../services/customerGroupDiscount.service')

const getProductsByCustomerGroup = async (req, res, next) => {
  const { customerGroupId, page, limit, keyword } = req.query
  try {
    const data = await CustomerProductDiscountService.getProductsByCustomerGroup({
      customerGroupId,
      page,
      limit,
      keyword,
    })
    return http.json(res, 'Thành công', STATUS_CODE.OK, data)
  } catch (error) {
    next(error)
  }
}

const createDiscount = async (req, res, next) => {
  const userId = req.user.id
  try {
    await CustomerProductDiscountService.createDiscount(req.body, userId)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateDiscount = async (req, res, next) => {
  const { id } = req.params
  try {
    await CustomerProductDiscountService.updateDiscount(id, req.body)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteDiscount = async (req, res, next) => {
  const { customerGroupId, productId } = req.body
  try {
    await CustomerProductDiscountService.deleteDiscount({ customerGroupId, productId })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const bulkUpdateDiscount = async (req, res, next) => {
  try {
    await CustomerProductDiscountService.bulkUpdateDiscount(req.body)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProductsByCustomerGroup,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  bulkUpdateDiscount,
}
