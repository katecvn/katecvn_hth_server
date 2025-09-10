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
    distinct: true
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    discounts: rows
  }
}

/**
 * Lấy chi tiết giảm giá theo ID
 */
const getDiscountById = async (id) => {
  return await db.CustomerGroupDiscount.findByPk(id, {
    include: [{ model: db.CustomerGroup, as: 'customerGroup' }]
  })
}

/**
 * Tạo giảm giá mới cho nhóm
 */
const createDiscount = async (data, userId) => {
  const { customerGroupId, discountTliype, discountValue } = data
  const transaction = await db.sequeze.transaction()

  try {
    const discount = await db.CustomerGroupDiscount.create(
      { customerGroupId, discountType, discountValue, status: 'active' },
      { transaction }
    )

    await db.CustomerGroupDiscountHistory.create(
      {
        customerGroupId,
        oldType: null,
        oldValue: null,
        newType: discountType,
        newValue: discountValue,
        changedBy: userId
      },
      { transaction }
    )

    await transaction.commit()
    return discount
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

/**
 * Cập nhật giảm giá hiện hành
 */
const updateDiscount = async (id, data, userId) => {
  const discount = await db.CustomerGroupDiscount.findByPk(id)
  if (!discount) throw new Error('Không tìm thấy giảm giá nhóm khách hàng')

  const transaction = await db.sequelize.transaction()
  try {
    const oldType = discount.discountType
    const oldValue = discount.discountValue

    await discount.update(
      {
        discountType: data.discountType,
        discountValue: data.discountValue
      },
      { transaction }
    )

    await db.CustomerGroupDiscountHistory.create(
      {
        customerGroupId: discount.customerGroupId,
        oldType,
        oldValue,
        newType: data.discountType,
        newValue: data.discountValue,
        changedBy: userId
      },
      { transaction }
    )

    await transaction.commit()
    return discount
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
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
    await discount.update({ status: 'inactive' }, { transaction })

    await db.CustomerGroupDiscountHistory.create(
      {
        customerGroupId: discount.customerGroupId,
        oldType: discount.discountType,
        oldValue: discount.discountValue,
        newType: discount.discountType,
        newValue: discount.discountValue,
        changedBy: userId
      },
      { transaction }
    )

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
  deleteDiscount
}
