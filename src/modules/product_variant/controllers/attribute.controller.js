const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const AttributeService = require('../services/attribute.service')

const createAttribute = async (req, res, next) => {
  const data = req.body
  const { id } = req.user
  try {
    const result = await AttributeService.createAttribute({
      ...data,
      creator: id
    })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const updateAttribute = async (req, res, next) => {
  const data = req.body
  const { id: updater } = req.user
  const { id } = req.params

  try {
    const result = await AttributeService.updateAttribute(id, {
      ...data,
      updater
    })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getAttributes = async (req, res, next) => {
  const query = req.query

  try {
    const result = await AttributeService.getAttributes(query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getAttributeById = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await AttributeService.getAttributeById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const deleteAttribute = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await AttributeService.deleteAttribute(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createAttribute,
  getAttributes,
  updateAttribute,
  getAttributeById,
  deleteAttribute
}
