const SupplierService = require('../services/supplier.service')
const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')

const getAllSuppliers = async (req, res, next) => {
  const { page, limit, keyword } = req.query
  try {
    const suppliers = await SupplierService.getAllSuppliers({ page, limit, keyword })
    return http.json(res, 'Thành công', STATUS_CODE.OK, suppliers)
  } catch (e) {
    next(e)
  }
}

const getSupplierById = async (req, res, next) => {
  const { id } = req.params
  try {
    const supplier = await SupplierService.getSupplierById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, supplier)
  } catch (e) {
    next(e)
  }
}

const createSupplier = async (req, res, next) => {
  const data = req.body
  const { user } = req

  try {
    await SupplierService.createSupplier(data, { id: user.id })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (e) {
    next(e)
  }
}

const updateSupplier = async (req, res, next) => {
  const { id } = req.params
  const { user } = req
  const data = req.body

  try {
    await SupplierService.updateSupplier(id, data, { id: user.id })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (e) {
    next(e)
  }
}

const deleteSupplier = async (req, res, next) => {
  const { id } = req.params
  const { user } = req

  try {
    await SupplierService.deleteSupplier(id, { id: user.id })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (e) {
    next(e)
  }
}

const SupplierController = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
}

module.exports = SupplierController
