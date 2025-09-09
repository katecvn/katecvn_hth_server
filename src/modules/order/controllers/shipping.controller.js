const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const shippingService = require('../services/shipping.service')

const createShipping = async (req, res, next) => {
  const data = req.body
  try {
    await shippingService.createShipping(data)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateShippingStatusById = async (req, res, next) => {
  const { id } = req.params
  const data = req.body
  try {
    await shippingService.updateShippingStatusById(id, data)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateShipping = async (req, res, next) => {
  const { id } = req.params
  const data = req.body

  try {
    await shippingService.updateShipping(id, data)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteShippingById = async (req, res, next) => {
  const { id } = req.params
  try {
    await shippingService.deleteShippingById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createShipping,
  updateShippingStatusById,
  updateShipping,
  deleteShippingById
}
