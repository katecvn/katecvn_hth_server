const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const SpecificationService = require('../services/specification.service')

const createSpecificationGroup = async (req, res, next) => {
  const data = req.body
  const { id } = req.user

  try {
    const result = await SpecificationService.createSpecificationGroup({
      ...data,
      creator: id
    })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const updateSpecificationGroup = async (req, res, next) => {
  const data = req.body
  const { id } = req.params
  const { id: updater } = req.user

  try {
    const result = await SpecificationService.updateSpecificationGroup(id, {
      ...data,
      updater
    })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getSpecificationGroups = async (req, res, next) => {
  const query = req.query

  try {
    const result = await SpecificationService.getSpecificationGroups(query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getSpecificationGroupById = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await SpecificationService.getSpecificationGroupById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const deleteSpecificationGroup = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await SpecificationService.deleteSpecificationGroup(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const createSpecification = async (req, res, next) => {
  const data = req.body
  const { id } = req.user

  try {
    const result = await SpecificationService.createSpecification({
      ...data,
      creator: id
    })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const updateSpecification = async (req, res, next) => {
  const data = req.body
  const { id } = req.params
  const { id: updater } = req.user

  try {
    const result = await SpecificationService.updateSpecification(id, {
      ...data,
      updater
    })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getSpecifications = async (req, res, next) => {
  const query = req.query

  try {
    const result = await SpecificationService.getSpecifications(query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getSpecificationById = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await SpecificationService.getSpecificationById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const deleteSpecification = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await SpecificationService.deleteSpecification(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createSpecificationGroup,
  updateSpecificationGroup,
  getSpecificationGroups,
  getSpecificationGroupById,
  deleteSpecificationGroup,
  createSpecification,
  updateSpecification,
  getSpecifications,
  getSpecificationById,
  deleteSpecification
}
