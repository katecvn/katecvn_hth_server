const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const OrderService = require('../services/order.service')

const getOrdersByDate = async (req, res, next) => {
  const query = req.query
  const { id } = req.user

  try {
    const result = await OrderService.getOrdersByDate({ id, ...query })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getOrdersByCustomer = async (req, res, next) => {
  const { id } = req.user
  const query = req.query

  try {
    const result = await OrderService.getOrderByCustomer({ id, ...query })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getOrderDetail = async (req, res, next) => {
  const { id } = req.params
  const { id: userId } = req.user

  try {
    const order = await OrderService.getOrderDetail(id, { ...userId })
    return http.json(res, 'Chi tiết hóa đơn', STATUS_CODE.OK, order)
  } catch (error) {
    next(error)
  }
}

const createOrder = async (req, res, next) => {
  const data = req.body

  try {
    const newOrder = await OrderService.createOrder(data)

    // await OrderService.sendOrderEmail(newOrder)

    return http.json(res, 'Thành công', STATUS_CODE.OK, newOrder)
  } catch (error) {
    next(error)
  }
}

const updateOrderStatusById = async (req, res, next) => {
  const { id } = req.params
  const data = req.body
  const { user } = req
  try {
    await OrderService.updateOrderStatusById(id, data, { id: user.id })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updatePaymentStatusById = async (req, res, next) => {
  const { id } = req.params
  const { paymentStatus } = req.body
  const { user } = req
  try {
    await OrderService.updateOrderPaymentStatusById({ id, paymentStatus }, { id: user.id })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteOrderById = async (req, res, next) => {
  const { id } = req.params
  try {
    await OrderService.deleteOrderById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const assignOrderTo = async (req, res, next) => {
  const { orderId, userId } = req.body
  try {
    await OrderService.assignOrderTo(orderId, userId)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const getPurchaseSummary = async (req, res, next) => {
  const query = req.query
  const { id } = req.user

  try {
    const result = await OrderService.getPurchaseSummary({ id, ...query })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}


module.exports = {
  getOrdersByDate,
  getOrdersByCustomer,
  assignOrderTo,
  getOrderDetail,
  createOrder,
  updateOrderStatusById,
  updatePaymentStatusById,
  deleteOrderById,
  getPurchaseSummary
}
