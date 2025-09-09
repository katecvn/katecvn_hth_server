const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const DiscountService = require('../services/discount.service')

const getDiscounts = async (req, res, next) => {
  const query = req.query

  try {
    const discounts = await DiscountService.getDiscounts(query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, discounts)
  } catch (error) {
    next(error)
  }
}

const getDiscountById = async (req, res, next) => {
  const { id } = req.params
  try {
    const discount = await DiscountService.getDiscountById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, discount)
  } catch (error) {
    next(error)
  }
}

const createDiscount = async (req, res, next) => {
  const data = req.body
  const { id } = req.user

  try {
    await DiscountService.createDiscount({ ...data, creator: id })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateDiscountById = async (req, res, next) => {
  const { id } = req.params
  const data = req.body
  const { id: updater } = req.user

  try {
    await DiscountService.updateDiscountById(id, { ...data, updater })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateStatus = async (req, res, next) => {
  const { id } = req.params
  const data = req.body
  const { id: updater } = req.user

  try {
    await DiscountService.updateStatus(id, { ...data, updater })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const applyDiscount = async (req, res, next) => {
  const data = req.body

  try {
    const responseData = await DiscountService.applyDiscount(data)
    return http.json(res, 'Thành công', STATUS_CODE.OK, responseData)
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params

  try {
    await DiscountService.deleteById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const getPublicDiscountProducts = async (req, res, next) => {
  try {
    const discountProducts = await DiscountService.getPublicDiscountProducts()
    return http.json(res, 'Thành công', STATUS_CODE.OK, discountProducts)
  } catch (error) {
    next(error)
  }
}

const getPublicDiscount = async (req, res, next) => {
  const data = req.body

  try {
    const discounts = await DiscountService.getPublicDiscount(data)
    return http.json(res, 'Thành công', STATUS_CODE.OK, discounts)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscountById,
  updateStatus,
  applyDiscount,
  deleteById,
  getPublicDiscountProducts,
  getPublicDiscount
}
