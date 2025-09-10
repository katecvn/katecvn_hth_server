const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const CustomerGroupDiscountHistoryService = require('../services/customerGroupDiscoutHistory.service')

const getHistories = async (req, res, next) => {
  const { page, limit, customerGroupId } = req.query
  try {
    const histories = await CustomerGroupDiscountHistoryService.getHistories({ page, limit, customerGroupId })
    return http.json(res, 'Thành công', STATUS_CODE.OK, histories)
  } catch (error) {
    next(error)
  }
}

const getHistoryById = async (req, res, next) => {
  const { id } = req.params
  try {
    const history = await CustomerGroupDiscountHistoryService.getHistoryById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, history)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getHistories,
  getHistoryById
}
