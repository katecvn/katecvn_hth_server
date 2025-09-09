const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const ContactService = require('../services/contact.service')

const getContacts = async (req, res, next) => {
  const { page, limit, keyword } = req.query
  try {
    const contacts = await ContactService.getContacts({ page, limit, keyword })
    return http.json(res, 'Thành công', STATUS_CODE.OK, contacts)
  } catch (error) {
    next(error)
  }
}

const getContactById = async (req, res, next) => {
  const { id } = req.params
  try {
    const contact = await ContactService.getContactById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, contact)
  } catch (error) {
    next(error)
  }
}

const createContact = async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body

  try {
    await ContactService.createContact({ name, email, phone, subject, message })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateStatus = async (req, res, next) => {
  const { status } = req.body
  const { id } = req.params
  try {
    await ContactService.updateStatus(id, status)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  const { id } = req.params

  try {
    await ContactService.deleteById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateStatus,
  deleteById,
  // sendEmail
}
