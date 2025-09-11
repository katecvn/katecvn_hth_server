const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')

/**
 * Lấy danh sách giảm giá nhóm
 */
const getDiscounts = async ({ page = 1, limit = 20, keyword }) => {
  const offset = (page - 1) * limit
  const where = {}

  if (keyword) {
    where['$customerGroup.name$'] = { [db.Sequelize.Op.like]: `%${keyword}%` }
  }

  const { count, rows } = await db.CustomerGroupDiscount.findAndCountAll({
    where,
    include: [{ model: db.CustomerGroup, as: 'customerGroup' }],
    offset,
    limit,
    distinct: true,
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    discounts: rows,
  }
}

/**
 * Lấy chi tiết giảm giá theo ID
 */
const getDiscountById = async (id) => {
  return await db.CustomerGroupDiscount.findByPk(id, {
    include: [{ model: db.CustomerGroup, as: 'customerGroup' }],
  })
}

/**
 * Tạo giảm giá mới cho nhóm
 */
const createDiscount = async (data, userId) => {
  const { customerGroupId, discountType, discountValue } = data
  const transaction = await db.sequelize.transaction()

  try {
    const existing = await db.CustomerGroupDiscount.findOne({
      where: { customerGroupId, status: 'active' },
      transaction,
    })
    if (existing) {
      throw new ServiceException(
        { message: message.isExisted },
        STATUS_CODE.UNPROCESSABLE_ENTITY
      )
    }

    const discount = await db.CustomerGroupDiscount.create(
      {
        customerGroupId,
        discountType: String(discountType),
        discountValue: Number(discountValue),
        status: 'active',
      },
      { transaction }
    )

    await db.CustomerGroupDiscountHistory.create(
      {
        customerGroupId,
        oldType: null,
        oldValue: null,
        newType: String(discountType),
        newValue: Number(discountValue),
        updatedBy: userId,
        updatedAt: new Date(),
      },
      { transaction }
    )

    await transaction.commit()
    return discount
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}


/**
 * Cập nhật giảm giá hiện hành
 */
const updateDiscount = async (id, data, userId) => {
  const discount = await db.CustomerGroupDiscount.findByPk(id)
  if (!discount) {
    throw new ServiceException(
      { message: message.notFound },
      STATUS_CODE.NOT_FOUND
    )
  }

  const transaction = await db.sequelize.transaction()
  try {
    const oldType = discount.discountType
    const oldValue = discount.discountValue

    await discount.update(
      {
        discountType: String(data.discountType),
        discountValue: Number(data.discountValue),
      },
      { transaction }
    )

    await db.CustomerGroupDiscountHistory.create(
      {
        customerGroupId: discount.customerGroupId,
        oldType,
        oldValue,
        newType: String(data.discountType),
        newValue: Number(data.discountValue),
        updatedBy: userId,
        updatedAt: new Date(),
      },
      { transaction }
    )

    await transaction.commit()
    return discount
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}



/**
 * Xóa (ngưng) giảm giá
 */
const deleteDiscount = async (id, userId) => {
  const discount = await db.CustomerGroupDiscount.findByPk(id)
  if (!discount) throw new Error('Không tìm thấy giảm giá nhóm khách hàng')

  const transaction = await db.sequelize.transaction()
  try {
    await db.CustomerGroupDiscountHistory.create(
      {
        customerGroupId: discount.customerGroupId,
        oldType: discount.discountType,
        oldValue: discount.discountValue,
        newType: null,
        newValue: null,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      { transaction }
    )

    await discount.destroy({ transaction })

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}


module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
}
