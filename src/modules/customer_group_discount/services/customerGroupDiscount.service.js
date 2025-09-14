const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')

/**
 * Lấy danh sách sản phẩm kèm giảm giá theo 1 nhóm khách hàng
 */
const getProductsByCustomerGroup = async ({ customerGroupId, page = 1, limit = 20, keyword }) => {
  const offset = (page - 1) * limit
  const where = {}

  if (keyword) {
    where.name = { [db.Sequelize.Op.like]: `%${keyword}%` }
  }

  const { count, rows } = await db.Product.findAndCountAll({
    where,
      include: [
        {
          model: db.CustomerGroupDiscount,
          as: 'customerDiscounts',
          where: { customerGroupId },
          required: false,
        },
      ],
    offset,
    limit,
    distinct: true,
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    products: rows,
  }
}

/**
 * Tạo giảm giá cho 1 sản phẩm trong group
 */
const createDiscount = async (data, userId) => {
  const { customerGroupId, productId, discountType, discountValue, status } = data
  const transaction = await db.sequelize.transaction()

  try {
    const existing = await db.CustomerGroupDiscount.findOne({
      where: { customerGroupId, productId, status: 'active' },
      transaction,
    })
    if (existing && (status === 'active' || !status)) {
      throw new ServiceException({ message: message.isExisted }, STATUS_CODE.UNPROCESSABLE_ENTITY)
    }

    const discount = await db.CustomerGroupDiscount.create(
      {
        customerGroupId,
        productId,
        discountType: String(discountType),
        discountValue: Number(discountValue),
        status: status || 'active',
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
 * Update giảm giá cho 1 sản phẩm
 */
const updateDiscount = async (id, data) => {
  const discount = await db.CustomerGroupDiscount.findByPk(id)
  if (!discount) {
    throw new ServiceException({ message: message.notFound }, STATUS_CODE.NOT_FOUND)
  }

  await discount.update({
    discountType: String(data.discountType || discount.discountType),
    discountValue: Number(data.discountValue ?? discount.discountValue),
    status: data.status || discount.status,
  })

  return discount
}

/**
 * Xóa giảm giá của 1 sản phẩm
 */
const deleteDiscount = async (id) => {
  const discount = await db.CustomerGroupDiscount.findByPk(id)
  if (!discount) throw new ServiceException({ message: message.notFound }, STATUS_CODE.NOT_FOUND)

  await discount.destroy()
  return true
}

/**
 * Bulk update giảm giá cho toàn bộ sản phẩm trong group
 */
const bulkUpdateDiscount = async ({ customerGroupId, discountType, discountValue, status }) => {
  await db.CustomerGroupDiscount.update(
    { discountType, discountValue, status },
    { where: { customerGroupId } }
  )
  return true
}

module.exports = {
  getProductsByCustomerGroup,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  bulkUpdateDiscount,
}
