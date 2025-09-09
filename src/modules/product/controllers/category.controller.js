const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const { sendResponse } = require('../../../utils/APIResponse')
const categoryService = require('../services/category.service')

const getAll = async (req, res) => {
  try {
    const { page, limit } = req.query

    const categories = await categoryService.getAllCategories({ page, limit })

    return sendResponse(res, { status: STATUS_CODE.OK, data: categories })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById({ id: req.params.id })
    if (!category) return res.status(404).json({ error: 'Category not found' })
    return sendResponse(res, { status: STATUS_CODE.OK, data: category })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const create = async (req, res) => {
  const data = req.body
  const { authId } = req.query
  try {
    const category = await categoryService.createCategory({ ...data, createdBy: authId })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: category })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const update = async (req, res) => {
  const data = req.body
  const { authId } = req.query
  const { id } = req.params

  try {
    const category = await categoryService.updateCategory({ id, updatedBy: authId, ...data })

    if (!category) return res.status(404).json({ error: `${message.notFound} danh mục` })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: category })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const remove = async (req, res) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id)

    if (!category) return sendResponse(res, { status: STATUS_CODE.NOT_FOUND, messages: message.notFound, data: [] })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAllWithHierarchy = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategoriesWithChildren()
    return sendResponse(res, { status: STATUS_CODE.OK, data: categories })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getBySlug = async (req, res) => {
  const { slug } = req.params

  try {
    const category = await categoryService.getCategoryBySlug({ slug })
    return sendResponse(res, { status: STATUS_CODE.OK, data: category })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}
module.exports = { getAll, getById, create, update, remove, getAllWithHierarchy, getBySlug }
