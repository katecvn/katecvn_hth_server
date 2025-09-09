const { STATUS_CODE } = require('../constants')
const { message } = require('../constants/message')
const PageService = require('../services/PageService')
const { sendResponse } = require('../utils/APIResponse')

const createPage = async (req, res) => {
  try {
    const { authId, parentId, title, slug, template, content, metaTitle, metaDescription, status } = { ...req.body, ...req.query }

    const page = await PageService.createPage({
      parentId,
      title,
      slug,
      template,
      content,
      metaTitle,
      metaDescription,
      createdBy: authId,
      updatedBy: authId
    })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: page })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const getPageById = async (req, res) => {
  try {
    const page = await PageService.getPageById({ id: req.params.id })
    if (!page) return res.status(404).json({ message: 'Page not found' })

    return sendResponse(res, { status: STATUS_CODE.OK, data: page })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const getAllPages = async (req, res) => {
  try {
    const pages = await PageService.getAllPages()
    return sendResponse(res, { status: STATUS_CODE.OK, data: pages })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const updatePage = async (req, res) => {
  try {
    const { authId, parentId, title, slug, template, content, metaTitle, metaDescription, status } = { ...req.body, ...req.query }

    const updated = await PageService.updatePage(req.params.id, {
      parentId,
      title,
      slug,
      template,
      content,
      metaTitle,
      metaDescription,
      status,
      updatedBy: authId
    })

    if (!updated[0]) return res.status(404).json({ message: 'Page not found' })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const deletePage = async (req, res) => {
  try {
    await PageService.deletePage(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const showBySlug = async (req, res) => {
  try {
    const slug = req.params.slug

    const page = await PageService.getPageBySlug({ slug })

    if (!page) return res.status(404).json({ message: 'Page not found' })

    return sendResponse(res, { status: STATUS_CODE.OK, data: page })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

module.exports = { createPage, getPageById, getAllPages, updatePage, deletePage, showBySlug }
