const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')
const { Op } = require('sequelize')

const getAllSuppliers = async ({ page = 1, limit = 10, keyword }) => {
  const offset = (page - 1) * limit
  const where = {
    ...(keyword && {
      [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } }]
    })
  }

  const { rows: suppliers, count } = await db.Supplier.findAndCountAll({
    where,
    limit,
    offset,
    attributes: { exclude: ['deletedAt'] },
    order: [['createdAt', 'DESC']]
  })

  return {
    totalItems: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    suppliers
  }
}

const getSupplierById = async (id) => {
  return await db.Supplier.findByPk(id)
}

const createSupplier = async (data, { id: creator }) => {
  const { name, contactPerson, email, address, phoneNumber } = data

  const transaction = await db.sequelize.transaction()
  try {
    const supplier = await db.Supplier.create(
      {
        name,
        contactPerson,
        email,
        address,
        phoneNumber,
        createdBy: creator
      },
      { transaction }
    )
    await transaction.commit()
    return supplier
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateSupplier = async (id, data, { id: updater }) => {
  const { name, contactPerson, email, address, phoneNumber } = data
  const supplier = await db.Supplier.findByPk(id)

  const transaction = await db.sequelize.transaction()
  try {
    await supplier.update(
      {
        name,
        contactPerson,
        email,
        address,
        phoneNumber,
        updatedBy: updater
      },
      { transaction }
    )
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteSupplier = async (id, { id: updater }) => {
  const supplier = await db.Supplier.findByPk(id)

  const transaction = await db.sequelize.transaction()
  try {
    await supplier.update(
      {
        updatedBy: updater
      },
      { transaction }
    )
    await supplier.destroy({
      transaction
    })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const SupplierService = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
}

module.exports = SupplierService
