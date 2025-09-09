const NotFoundException = require('../../../exceptions/NotFoundException')
const db = require('../models')

const createPayment = async (data) => {
  const { orderId, paymentMethod, transactionId, amount, status } = data
  const transaction = await db.sequelize.transaction()
  try {
    const payment = await db.Payment.create(
      {
        orderId,
        paymentMethod,
        transactionId,
        amount,
        status
      },
      { transaction }
    )
    await transaction.commit()
    return payment
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updatePaymentStatusById = async (id, status) => {
  const payment = await db.Payment.findByPk(id)

  const transaction = await db.sequelize.transaction()
  try {
    await payment.update(
      {
        status
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

const deletePaymentById = async (id) => {
  const payment = await db.Payment.findByPk(id)

  const transaction = await db.sequelize.transaction()
  try {
    await payment.destroy({ transaction })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

module.exports = {
  createPayment,
  updatePaymentStatusById,
  deletePaymentById
}
