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
    const basePrice = Number(product.salePrice || product.originalPrice || 0)

    const activeDiscount = (product.customerDiscounts || []).find(
      (d) => d.status === 'active'
    )

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

    // history: từ không giảm giá -> có giảm giá
    await db.CustomerGroupDiscountHistory.create(
      {
        customerGroupId,
        productId,
        oldType: null,
        oldValue: null,
        newType: discountType,
        newValue: discountValue,
        updatedBy: userId,
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

const updateDiscount = async (id, data, userId) => {
  const discount = await db.CustomerGroupDiscount.findByPk(id)
  if (!discount) {
    throw new ServiceException({ message: message.notFound }, STATUS_CODE.NOT_FOUND)
  }

  const oldType = discount.discountType
  const oldValue = discount.discountValue
  const oldStatus = discount.status

  const newType = String(data.discountType || discount.discountType)
  const newValue = Number(data.discountValue ?? discount.discountValue)
  const newStatus = data.status || discount.status

  await discount.update({
    discountType: newType,
    discountValue: newValue,
    status: newStatus,
  })

  // history
  await db.CustomerGroupDiscountHistory.create({
    customerGroupId: discount.customerGroupId,
    productId: discount.productId,
    oldType: oldStatus === 'active' ? oldType : null,
    oldValue: oldStatus === 'active' ? oldValue : null,
    newType: newStatus === 'active' ? newType : null,
    newValue: newStatus === 'active' ? newValue : null,
    updatedBy: userId,
  })

  return discount
}

const deleteDiscount = async ({ customerGroupId, productId, userId }) => {
  const discount = await db.CustomerGroupDiscount.findOne({
    where: { customerGroupId, productId },
  })
  if (!discount) {
    throw new ServiceException({ message: message.notFound }, STATUS_CODE.NOT_FOUND)
  }

  const oldType = discount.discountType
  const oldValue = discount.discountValue

  await discount.destroy()

  // history: từ có giảm giá -> không giảm giá
  await db.CustomerGroupDiscountHistory.create({
    customerGroupId,
    productId,
    oldType,
    oldValue,
    newType: null,
    newValue: null,
    updatedBy: userId,
  })

  return true
}

const bulkUpdateDiscount = async ({ customerGroupId, discountType, discountValue, status, productIds, userId }) => {
  const transaction = await db.sequelize.transaction()
  try {
    for (const productId of productIds) {
      // Lấy bản ghi active hiện tại
      const activeDiscount = await db.CustomerGroupDiscount.findOne({
        where: { customerGroupId, productId, status: 'active' },
        transaction,
      })

      let oldType = null
      let oldValue = null
      if (activeDiscount) {
        oldType = activeDiscount.discountType
        oldValue = activeDiscount.discountValue
      }

      // Tìm bản ghi discount bất kỳ (cùng group + product)
      const existing = await db.CustomerGroupDiscount.findOne({
        where: { customerGroupId, productId },
        transaction,
      })

      let newType = null
      let newValue = null

      if (existing) {
        await existing.update(
          { discountType, discountValue, status },
          { transaction }
        )

        if (status === 'active') {
          newType = discountType
          newValue = discountValue
        }
      } else {
        const created = await db.CustomerGroupDiscount.create(
          {
            customerGroupId,
            productId,
            discountType,
            discountValue,
            status,
            createdBy: userId,
          },
          { transaction }
        )

        if (status === 'active') {
          newType = created.discountType
          newValue = created.discountValue
        }
      }

      // Tạo log
      await db.CustomerGroupDiscountHistory.create(
        {
          customerGroupId,
          productId,
          oldType,
          oldValue,
          newType,
          newValue,
          updatedBy: userId,
        },
        { transaction }
      )
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
