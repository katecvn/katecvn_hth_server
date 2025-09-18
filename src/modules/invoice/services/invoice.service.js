// services/invoice.service.js
const db = require('../../../models')
const { Sequelize, Op } = require('sequelize')

const pad = (n, width = 5) => String(n).padStart(width, '0')
const ym = (d) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${year}${month}`
}

const generateInvoiceNumber = async (transaction, baseDate = new Date()) => {
  const yymm = ym(baseDate)
  const prefix = `INV${yymm}-`
  const last = await db.Invoice.findOne({
    where: { invoiceNumber: { [Op.like]: `${prefix}%` } },
    order: [['invoiceNumber', 'DESC']],
    transaction,
    lock: transaction.LOCK.UPDATE,
  })
  let nextSeq = 1
  if (last && last.invoiceNumber) {
    const parts = last.invoiceNumber.split('-')
    const lastNum = parseInt(parts[1], 10)
    if (!Number.isNaN(lastNum)) nextSeq = lastNum + 1
  }
  let candidate = `${prefix}${pad(nextSeq)}`
  for (let i = 0; i < 10; i++) {
    const exists = await db.Invoice.count({
      where: { invoiceNumber: candidate },
      transaction,
      lock: transaction.LOCK.UPDATE,
    })
    if (exists === 0) return candidate
    nextSeq++
    candidate = `${prefix}${pad(nextSeq)}`
  }
  throw new Error('Không thể sinh số hóa đơn duy nhất, vui lòng thử lại')
}

const getInvoices = async (data) => {
  const { page = 1, limit = 20, keyword } = data
  const offset = (page - 1) * limit
  const conditions = {}
  if (keyword) {
    conditions[Op.or] = [
      { invoiceNumber: { [Op.like]: `%${keyword}%` } },
      { note: { [Op.like]: `%${keyword}%` } },
      { companyName: { [Op.like]: `%${keyword}%` } },
      { companyTaxCode: { [Op.like]: `%${keyword}%` } },
    ]
  }
  const { count, rows: invoices } = await db.Invoice.findAndCountAll({
    where: conditions,
    include: [
      {
        model: db.Order,
        as: 'order',
        attributes: ['id', 'code', 'totalAmount', 'status'],
      },
    ],
    offset,
    limit,
    distinct: true,
    order: [['createdAt', 'DESC']],
  })
  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    invoices,
  }
}

const getInvoiceById = async (id) => {
  return await db.Invoice.findByPk(id, {
    include: [
      {
        model: db.Order,
        as: 'order',
        attributes: ['id', 'code', 'totalAmount', 'status'],
      },
    ],
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
    createdBy,
    companyName,
    companyTaxCode,
    companyAddress,
    companyEmail,
    companyPhone,
  } = data

  const transaction = await db.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  })
  try {
    const invNo =
      invoiceNumber && invoiceNumber.trim()
        ? invoiceNumber.trim()
        : await generateInvoiceNumber(transaction, issueDate ? new Date(issueDate) : new Date())

    const invoice = await db.Invoice.create(
      {
        orderId,
        invoiceNumber: invNo,
        issueDate,
        dueDate,
        subTotal,
        discountAmount,
        taxAmount,
        totalAmount,
        status: 'draft',
        note,
        companyName,
        companyTaxCode,
        companyAddress,
        companyEmail,
        companyPhone,
        createdBy,
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
  if (invoice.status !== 'draft') throw new Error('Chỉ có thể chỉnh sửa hóa đơn ở trạng thái nháp (draft)')

  const {
    subTotal,
    discountAmount,
    taxAmount,
    totalAmount,
    dueDate,
    note,
    companyName,
    companyTaxCode,
    companyAddress,
    companyEmail,
    companyPhone,
  } = data

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
        companyName,
        companyTaxCode,
        companyAddress,
        companyEmail,
        companyPhone,
        updatedBy,
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
    await invoice.update({ status, updatedBy }, { transaction })
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

const bulkCreateInvoices = async (data, actorId) => {
  const { orderIds = [], issueDate, dueDate, note, companyName, companyTaxCode, companyAddress, companyEmail, companyPhone } = data
  if (!Array.isArray(orderIds) || orderIds.length === 0) throw new Error('Danh sách đơn hàng trống')

  const transaction = await db.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  })
  try {
    const orders = await db.Order.findAll({
      where: { id: { [Op.in]: orderIds } },
      attributes: ['id', 'code', 'status', 'totalAmount', 'subTotal', 'discountAmount'],
      transaction,
      lock: transaction.LOCK.UPDATE,
    })

    if (orders.length !== orderIds.length) throw new Error('Một số đơn hàng không tồn tại')

    const created = []
    for (const o of orders) {
      const invNo = await generateInvoiceNumber(transaction, issueDate ? new Date(issueDate) : new Date())
      const subTotal = Number(o.subTotal ?? o.totalAmount ?? 0)
      const discountAmount = Number(o.discountAmount ?? 0)
      const taxAmount = 0
      const totalAmount = Number(o.totalAmount ?? Math.max(subTotal - discountAmount + taxAmount, 0))
      const invoice = await db.Invoice.create(
        {
          orderId: o.id,
          invoiceNumber: invNo,
          issueDate: issueDate || new Date(),
          dueDate: dueDate || null,
          subTotal,
          discountAmount,
          taxAmount,
          totalAmount,
          status: 'draft',
          note: note || null,
          companyName: companyName || null,
          companyTaxCode: companyTaxCode || null,
          companyAddress: companyAddress || null,
          companyEmail: companyEmail || null,
          companyPhone: companyPhone || null,
          createdBy: actorId || null,
        },
        { transaction }
      )
      created.push(invoice)
    }

    await transaction.commit()
    return created
  } catch (e) {
    await transaction.rollback()
    throw new Error(e.message)
  }
}

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  updateStatus,
  deleteById,
  bulkCreateInvoices,
}
