const { STATUS_CODE } = require('../constants')
const { message } = require('../constants/message')
const PageSectionService = require('../services/PageSectionService')
const { sendResponse } = require('../utils/APIResponse')

const createPageSection = async (req, res) => {
  try {
    const { authId, pageId, sectionType, content, position } = { ...req.body, ...req.query }

    const section = await PageSectionService.createPageSection({ pageId, sectionType, content, position, createdBy: authId, updatedBy: authId })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: section })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const getPageSectionById = async (req, res) => {
  try {
    const section = await PageSectionService.getPageSectionById({ id: req.params.id })
    if (!section) return res.status(404).json({ message: 'Page Section not found' })

    return sendResponse(res, { status: STATUS_CODE.OK, data: section })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const getAllPageSections = async (req, res) => {
  try {
    const data = req.query

    const sections = await PageSectionService.getAllPageSections(data)

    return sendResponse(res, { status: STATUS_CODE.OK, data: sections })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const updatePageSection = async (req, res) => {
  try {
    const { authId, pageId, sectionType, content, position } = { ...req.body, ...req.query }

    const updated = await PageSectionService.updatePageSection(req.params.id, { pageId, sectionType, content, position, updatedBy: authId })

    if (!updated[0]) return res.status(404).json({ message: 'Page Section not found' })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const deletePageSection = async (req, res) => {
  try {
    await PageSectionService.deletePageSection(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

module.exports = { createPageSection, getPageSectionById, getAllPageSections, updatePageSection, deletePageSection }
