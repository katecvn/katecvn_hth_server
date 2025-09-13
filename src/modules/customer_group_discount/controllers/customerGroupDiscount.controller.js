const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const CustomerGroupDiscountService = require('../services/customerGroupDiscount.service')

const getDiscounts = async (req, res, next) => {
  const { page, limit, keyword } = req.query
  try {
    const discounts = await CustomerGroupDiscountService.getDiscounts({ page, limit, keyword })
    return http.json(res, 'Thành công', STATUS_CODE.OK, discounts)
  } catch (error) {
    next(error)
  }
}

const getDiscountById = async (req, res, next) => {
  const { id } = req.params
  try {
    const discount = await CustomerGroupDiscountService.getDiscountById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, discount)
  } catch (error) {
    next(error)
  }
}

const createDiscount = async (req, res, next) => {
  const { customerGroupId, productId, discountType, discountValue, status } = req.body
  const userId = req.user.id

  try {
    await CustomerGroupDiscountService.createDiscount(
      { customerGroupId, productId, discountType, discountValue, status },
      userId
    )
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateDiscount = async (req, res, next) => {
  const { id } = req.params
  const { productId, discountType, discountValue, status } = req.body
  const userId = req.user.id

  try {
    await CustomerGroupDiscountService.updateDiscount(
      id,
      { productId, discountType, discountValue, status },
      userId
    )
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteDiscount = async (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    await CustomerGroupDiscountService.deleteDiscount(id, userId)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
}
