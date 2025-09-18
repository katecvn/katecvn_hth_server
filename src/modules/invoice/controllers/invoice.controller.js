// controllers/invoice.controller.js
const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const InvoiceService = require('../services/invoice.service')

const getInvoices = async (req, res, next) => {
  const { page, limit, keyword } = req.query
  try {
    const invoices = await InvoiceService.getInvoices({ page, limit, keyword })
    return http.json(res, 'Thành công', STATUS_CODE.OK, invoices)
  } catch (error) {
    next(error)
  }
}

const getInvoiceById = async (req, res, next) => {
  const { id } = req.params
  try {
    const invoice = await InvoiceService.getInvoiceById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, invoice)
  } catch (error) {
    next(error)
  }
}

const createInvoice = async (req, res, next) => {
  try {
    await InvoiceService.createInvoice({ ...req.body, createdBy: req.user?.id || null })
    return http.json(res, 'Tạo hóa đơn thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const bulkCreateInvoices = async (req, res, next) => {
  try {
    const result = await InvoiceService.bulkCreateInvoices(req.body, req.user?.id || null)
    return http.json(res, 'Tạo hóa đơn hàng loạt thành công', STATUS_CODE.OK, { count: result.length, invoices: result })
  } catch (error) {
    next(error)
  }
}

const updateInvoice = async (req, res, next) => {
  const { id } = req.params
  try {
    await InvoiceService.updateInvoice(id, req.body, req.user?.id || null)
    return http.json(res, 'Cập nhật hóa đơn thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateStatus = async (req, res, next) => {
  const { status } = req.body
  const { id } = req.params
  try {
    await InvoiceService.updateStatus(id, status, req.user?.id || null)
    return http.json(res, 'Cập nhật trạng thái thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params
  try {
    await InvoiceService.deleteById(id)
    return http.json(res, 'Xóa hóa đơn thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  bulkCreateInvoices,
  updateInvoice,
  updateStatus,
  deleteById,
}
