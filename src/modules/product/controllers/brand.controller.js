const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const { sendResponse } = require('../../../utils/APIResponse')
const BrandService = require('../services/brand.service')

const create = async (req, res) => {
  try {
    const { categoryIds, name, description, authId, imageUrl, iconUrl } = { ...req.body, ...req.query }

    const brand = await BrandService.createBrand({ categoryIds, name, description, imageUrl, iconUrl, createdBy: authId })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: brand })
  } catch (error) {
    console.log('error>>', error)
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAll = async (req, res) => {
  try {
    const { page, limit, categoryId } = req.query

    const brands = await BrandService.getAllBrands({ page, limit, categoryId })

    return sendResponse(res, { status: STATUS_CODE.OK, data: brands })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getById = async (req, res) => {
  try {
    const brand = await BrandService.getBrandById({ id: req.params.id })

    if (!brand) return res.status(404).json({ error: 'brand not found' })

    return sendResponse(res, { status: STATUS_CODE.OK, data: brand })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const update = async (req, res) => {
  try {
    const { id, categoryIds, name, description, imageUrl, authId, iconUrl } = { ...req.params, ...req.body, ...req.query }

    const brand = await BrandService.updateBrand({ id, categoryIds, name, description, imageUrl, iconUrl, updatedBy: authId })

    if (!brand) return sendResponse(res, { status: STATUS_CODE.NOT_FOUND, messages: message.notFound })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: brand })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const remove = async (req, res) => {
  try {
    const { id, authId } = { ...req.params, ...req.query }

    const brand = await BrandService.deleteBrand({ id, updatedBy: authId })

    if (!brand) return sendResponse(res, { status: STATUS_CODE.NOT_FOUND, messages: message.notFound, data: [] })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }
