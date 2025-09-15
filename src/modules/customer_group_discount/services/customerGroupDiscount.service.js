const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')

const getProductsByCustomerGroup = async ({ customerGroupId, page = 1, limit = 9999, keyword }) => {
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
  const products = rows.map((p) => {
    const product = p.toJSON()
    const basePrice = Number(product.salePrice || product.price || 0)
    const activeDiscount = (product.customerDiscounts || []).find((d) => d.status === 'active')
    let finalPrice = basePrice
    if (activeDiscount) {
      if (activeDiscount.discountType === 'percentage') {
        finalPrice = basePrice - (basePrice * Number(activeDiscount.discountValue)) / 100
      } else if (activeDiscount.discountType === 'fixed') {
        finalPrice = basePrice - Number(activeDiscount.discountValue)
      }
      if (finalPrice < 0) finalPrice = 0
    }
    return {
      ...product,
      currentDiscount: activeDiscount || null,
      finalPrice,
    }
  })
  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    products,
  }
}

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
        createdBy: userId,
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

const deleteDiscount = async ({ customerGroupId, productId }) => {
  const discount = await db.CustomerGroupDiscount.findOne({
    where: { customerGroupId, productId },
  })
  if (!discount) throw new ServiceException({ message: message.notFound }, STATUS_CODE.NOT_FOUND)
  await discount.destroy()
  return true
}

const bulkUpdateDiscount = async ({ customerGroupId, discountType, discountValue, status, productIds }) => {
  const transaction = await db.sequelize.transaction()
  try {
    for (const productId of productIds) {
      const existing = await db.CustomerGroupDiscount.findOne({
        where: { customerGroupId, productId },
        transaction,
      })

      if (existing) {
        await existing.update(
          { discountType, discountValue, status },
          { transaction }
        )
      } else {
        await db.CustomerGroupDiscount.create(
          {
            customerGroupId,
            productId,
            discountType,
            discountValue,
            status,
          },
          { transaction }
        )
      }
    }

    await transaction.commit()
    return true
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}


module.exports = {
  getProductsByCustomerGroup,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  bulkUpdateDiscount,
}
