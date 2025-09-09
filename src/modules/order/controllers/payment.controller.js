const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const paymentService = require('../services/payment.service')

const createPayment = async (req, res, next) => {
  const data = req.body
  try {
    await paymentService.createPayment(data)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updatePaymentStatusById = async (req, res, next) => {
  const { id } = req.params
  const { status } = req.body
  try {
    await paymentService.updatePaymentStatusById(id, status)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deletePaymentById = async (req, res, next) => {
  const { id } = req.params
  try {
    await paymentService.deletePaymentById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createPayment,
  updatePaymentStatusById,
  deletePaymentById
}
