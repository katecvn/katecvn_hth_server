const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const CustomerGroupDiscountHistoryService = require('../services/customerGroupDiscountHistory.service')

/**
 * Lấy danh sách lịch sử giảm giá nhóm khách hàng
 */
const getHistories = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, customerGroupId } = req.query

    const histories = await CustomerGroupDiscountHistoryService.getHistories({
      page: Number(page),
      limit: Number(limit),
      customerGroupId: customerGroupId ? Number(customerGroupId) : undefined,
    })

    return http.json(res, 'Thành công', STATUS_CODE.OK, histories)
  } catch (error) {
    next(error)
  }
}

/**
 * Lấy chi tiết 1 record lịch sử giảm giá
 */
const getHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) {
      return http.json(res, 'Thiếu ID lịch sử', STATUS_CODE.BAD_REQUEST)
    }

    const history = await CustomerGroupDiscountHistoryService.getHistoryById(
      Number(id)
    )

    return http.json(res, 'Thành công', STATUS_CODE.OK, history)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getHistories,
  getHistoryById,
}
