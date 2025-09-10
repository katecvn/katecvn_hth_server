const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const CustomerGroupService = require('../services/customerGroup.service')

const getCustomerGroups = async (req, res, next) => {
  const { page, limit, keyword } = req.query
  try {
    const groups = await CustomerGroupService.getCustomerGroups({ page, limit, keyword })
    return http.json(res, 'Thành công', STATUS_CODE.OK, groups)
  } catch (error) {
    next(error)
  }
}

const getCustomerGroupById = async (req, res, next) => {
  const { id } = req.params
  try {
    const group = await CustomerGroupService.getCustomerGroupById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, group)
  } catch (error) {
    next(error)
  }
}

const createCustomerGroup = async (req, res, next) => {
  const { name } = req.body
  try {
    await CustomerGroupService.createCustomerGroup({ name })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateCustomerGroup = async (req, res, next) => {
  const { id } = req.params
  const { name } = req.body
  try {
    await CustomerGroupService.updateCustomerGroup(id, { name })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteCustomerGroup = async (req, res, next) => {
  const { id } = req.params
  try {
    await CustomerGroupService.deleteCustomerGroup(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCustomerGroups,
  getCustomerGroupById,
  createCustomerGroup,
  updateCustomerGroup,
  deleteCustomerGroup
}
