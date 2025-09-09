const { SHIPPING_STATUS } = require('../../../constants')
const db = require('../models')

const createShipping = async (data) => {
  const { orderId, trackingNumber, shippingMethod, shippingStatus, estimatedDelivery, deliveredAt } = data

  const transaction = await db.sequelize.transaction()
  try {
    const shipping = await db.Shipping.create(
      {
        orderId,
        trackingNumber,
        shippingMethod,
        shippingStatus,
        estimatedDelivery,
        deliveredAt
      },
      { transaction }
    )
    await transaction.commit()
    return shipping
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updateShippingStatusById = async (id, data) => {
  const { status, deliveredAt = null } = data
  const shipping = await db.Shipping.findByPk(id)

  try {
    await shipping.update({
      shippingStatus: status,
      deliveredAt: status === SHIPPING_STATUS.DELIVERED ? deliveredAt : null
    })
    return true
  } catch (error) {
    throw new Error(error.message)
  }
}

const updateShipping = async (id, data) => {
  const { status, estimatedDelivery, deliveredAt } = data
  const shipping = await db.Shipping.findByPk(id)
  const date = deliveredAt?.toString() || null

  const transaction = await db.sequelize.transaction()
  try {
    await shipping.update(
      {
        shippingStatus: status,
        estimatedDelivery,
        deliveredAt: date
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

const deleteShippingById = async (id) => {
  const shipping = await db.Shipping.findByPk(id)

  const transaction = await db.sequelize.transaction()
  try {
    await shipping.destroy({ transaction })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

module.exports = {
  createShipping,
  updateShippingStatusById,
  updateShipping,
  deleteShippingById
}
