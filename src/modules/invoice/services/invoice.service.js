const db = require('../../../models')

const getInvoices = async (data) => {
  const { page = 1, limit = 20, keyword } = data
  const offset = (page - 1) * limit
  const conditions = {}

  if (keyword) {
    conditions[db.Sequelize.Op.or] = [
      { invoiceNumber: { [db.Sequelize.Op.like]: `%${keyword}%` } },
      { note: { [db.Sequelize.Op.like]: `%${keyword}%` } }
    ]
  }

  const { count, rows: invoices } = await db.Invoice.findAndCountAll({
    where: conditions,
    include: [
      {
        model: db.Order,
        as: 'order',
        attributes: ['id', 'code', 'totalAmount', 'status']
      }
    ],
    offset,
    limit,
    distinct: true,
    order: [['createdAt', 'DESC']]
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    invoices
  }
}

const getInvoiceById = async (id) => {
  return await db.Invoice.findByPk(id, {
    include: [
      {
        model: db.Order,
        as: 'order',
        attributes: ['id', 'code', 'totalAmount', 'status']
      }
    ]
  })
}

const createInvoice = async (data) => {
  const {
    orderId,
    invoiceNumber,
    issueDate,
    dueDate,
    subTotal,
    discountAmount,
    taxAmount,
    totalAmount,
    note,
    createdBy
  } = data

  const transaction = await db.sequelize.transaction()
  try {
    const invoice = await db.Invoice.create(
      {
        orderId,
        invoiceNumber,
        issueDate,
        dueDate,
        subTotal,
        discountAmount,
        taxAmount,
        totalAmount,
        status: 'draft',
        note,
        createdBy
      },
      { transaction }
    )
    await transaction.commit()
    return invoice
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updateInvoice = async (id, data, updatedBy) => {
  const invoice = await db.Invoice.findByPk(id)
  if (!invoice) throw new Error('Không tìm thấy hóa đơn')

  if (invoice.status !== 'draft') {
    throw new Error('Chỉ có thể chỉnh sửa hóa đơn ở trạng thái nháp (draft)')
  }

  const { subTotal, discountAmount, taxAmount, totalAmount, dueDate, note } = data

  const transaction = await db.sequelize.transaction()
  try {
    await invoice.update(
      {
        subTotal,
        discountAmount,
        taxAmount,
        totalAmount,
        dueDate,
        note,
        updatedBy
      },
      { transaction }
    )
    await transaction.commit()
    return invoice
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updateStatus = async (id, status, updatedBy) => {
  const invoice = await db.Invoice.findByPk(id)
  if (!invoice) throw new Error('Không tìm thấy hóa đơn')

  const transaction = await db.sequelize.transaction()
  try {
    await invoice.update(
      {
        status,
        updatedBy
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

const deleteById = async (id) => {
  const invoice = await db.Invoice.findByPk(id)
  if (!invoice) throw new Error('Không tìm thấy hóa đơn')

  const transaction = await db.sequelize.transaction()
  try {
    await invoice.destroy({ transaction })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  updateStatus,
  deleteById
}
