const db = require('../../../models')
const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')

/**
 * Lấy danh sách lịch sử giảm giá nhóm khách hàng
 */
const getHistories = async ({ page = 1, limit = 20, customerGroupId }) => {
  try {
    const offset = (page - 1) * limit
    const where = {}

    if (customerGroupId) {
      where.customerGroupId = customerGroupId
    }

    const { count, rows } =
      await db.CustomerGroupDiscountHistory.findAndCountAll({
        where,
        include: [
          { model: db.CustomerGroup, as: 'customerGroup' },
          { model: db.User, as: 'updatedUser' },
        ],
        order: [['createdAt', 'DESC']],
        offset,
        limit,
        distinct: true,
      })

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      histories: rows,
    }
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Lấy chi tiết 1 record lịch sử giảm giá
 */
const getHistoryById = async (id) => {
  try {
    const history = await db.CustomerGroupDiscountHistory.findByPk(id, {
      include: [
        { model: db.CustomerGroup, as: 'customerGroup' },
        { model: db.User, as: 'updatedUser' }, 
      ],
    })

    if (!history) {
      throw new ServiceException(
        'Lịch sử giảm giá không tồn tại',
        STATUS_CODE.NOT_FOUND
      )
    }

    return history
  } catch (error) {
    throw new ServiceException(
      error.message,
      error.status || STATUS_CODE.INTERNAL_SERVER_ERROR
    )
  }
}

module.exports = {
  getHistories,
  getHistoryById,
}
