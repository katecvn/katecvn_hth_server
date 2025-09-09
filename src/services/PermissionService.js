const { STATUS_CODE } = require('../constants')
const ServiceException = require('../exceptions/ServiceException')
const db = require('../models')

const getAllPermissions = async () => {
  try {
    return await db.Permission.findAll({ include: [{ model: db.Permission, as: 'children' }] })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getPermissionById = async ({ id }) => {
  try {
    return await db.Permission.findOne({ where: { id }, include: [{ model: db.Permission, as: 'children' }] })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const createPermission = async (data) => {
  try {
    return await db.Permission.create(data)
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updatePermission = async (id, data) => {
  try {
    return await db.Permission.update(data, { where: { id } })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deletePermission = async (id) => {
  try {
    return await db.Permission.destroy({ where: { id } })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getPermissionByName = async ({ name, notInIds = [] }) => {
  try {
    const whereClause = { name }

    if (notInIds.length) {
      whereClause.id = { [db.Sequelize.Op.notIn]: notInIds }
    }

    return await db.Permission.findOne({ where: whereClause })
  } catch (e) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getPermissionsByIds = async ({ ids }) => {
  try {
    return await db.Permission.findAll({
      where: { id: { [db.Sequelize.Op.in]: ids } },
      include: [{ model: db.Permission, as: 'children' }]
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionByName,
  getPermissionsByIds
}
