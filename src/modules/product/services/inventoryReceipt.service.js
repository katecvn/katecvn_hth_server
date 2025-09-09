const ServiceException = require('../../../exceptions/ServiceException')
const { RECEIPT_TYPE, STATUS_CODE, RECEIPT_STATUS } = require('../../../constants')
const db = require('../../../models')
const moment = require('moment')
const { Op } = require('sequelize')
const convertDateFormat = require('../../../utils/ConvertDateFormat')

const getAllReceipts = async ({ page = 1, limit = 10, fromDate, toDate }) => {
  const offset = (page - 1) * limit
  const conditions = {}
  if (fromDate && toDate) {
    const { startDate, endDate } = convertDateFormat(fromDate, toDate)
    conditions.createdAt = {
      [Op.between]: [startDate, endDate]
    }
  }

  const { count, rows: receipts } = await db.InventoryReceipt.findAndCountAll({
    limit,
    offset,
    where: conditions,
    include: [
      {
        model: db.InventoryReceiptDetail,
        as: 'receiptDetails',
        include: [{ model: db.Batch, as: 'batch' }]
      },
      { model: db.Product, as: 'products' },
      { model: db.User, as: 'user', attributes: ['id', 'code', 'full_name', 'email', 'phone_number'] }
    ],
    order: [['createdAt', 'DESC']],
    distinct: true
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    receipts
  }
}

const getReceiptById = async (id) => {
  return await db.InventoryReceipt.findOne({
    where: {
      id
    },
    include: [
      {
        model: db.InventoryReceiptDetail,
        as: 'receiptDetails',
        include: [{ model: db.Batch, as: 'batch' }]
      },
      { model: db.Product, as: 'products' },
      { model: db.User, as: 'user' }
    ],
    order: [['createdAt', 'DESC']]
  })
}

const createReceipt = async (data, { id: creator }) => {
  const { receiptType, dateTime, notes, items } = data
  const code = await generateReceiptCode(receiptType)

  const transaction = await db.sequelize.transaction()
  try {
    const receipt = await db.InventoryReceipt.create({
      code,
      receiptType,
      dateTime,
      notes,
      status: RECEIPT_STATUS.PENDING,
      userId: creator,
      createdBy: creator
    }, { transaction })

    await Promise.all(
      items.map(async (item) => {
        const { productId, supplierId, unit, quantity, costPrice, mfgDate, expDate } = item

        const batch = await db.Batch.create({
          productId: productId,
          supplierId,
          unit,
          quantity,
          costPrice,
          mfgDate,
          expDate,
          createdBy: creator
        }, { transaction })

        await receipt.createReceiptDetail({
          receiptId: receipt.id,
          batchId: batch.id,
          quantity,
          unit,
          price: costPrice,
          ProductId: productId
        }, { transaction })
      })
    )
    await transaction.commit()
    return receipt
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateReceipt = async (receiptId, updateData, { id: userId }) => {
  const { receiptType, dateTime, notes, items } = updateData

  const receipt = await db.InventoryReceipt.findOne({
    where: {
      id: receiptId,
      status: RECEIPT_STATUS.PENDING
    },
  })

  if (!receipt) {
    throw new ServiceException({
      id: 'Phiếu thu không tồn tại hoặc đã được duyệt.',
    }, STATUS_CODE.BAD_REQUEST)
  }

  const transaction = await db.sequelize.transaction()

  try {
    if (receiptType) receipt.receiptType = receiptType
    if (dateTime) receipt.dateTime = dateTime
    if (notes) receipt.notes = notes
    receipt.updatedBy = userId

    await receipt.save({ transaction })

    if (items && items.length > 0) {
      const existingDetails = await db.InventoryReceiptDetail.findAll({
        where: { receiptId: receipt.id },
        include: [{ model: db.Batch, as: 'batch' }],
        transaction
      })

      for (const detail of existingDetails) {
        if (detail.batch) {
          await detail.batch.destroy({ transaction })
        }

        await detail.destroy({ transaction })
      }

      for (const item of items) {
        const { productId, supplierId, unit, quantity, costPrice, mfgDate, expDate } = item

        const batch = await db.Batch.create({
          productId,
          supplierId,
          unit,
          quantity,
          costPrice,
          mfgDate,
          expDate,
          createdBy: userId
        }, { transaction })

        await db.InventoryReceiptDetail.create({
          receiptId: receipt.id,
          batchId: batch.id,
          quantity,
          unit,
          price: costPrice,
          ProductId: productId
        }, { transaction })
      }
    }

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateReceiptStatus = async (id, data, { id: updater }) => {
  const { status } = data
  const receipt = await db.InventoryReceipt.findOne({
    where: { id },
    include: [
      { model: db.InventoryReceiptDetail, as: 'receiptDetails' }
    ]
  })

  const transaction = await db.sequelize.transaction()
  try {
    await receipt.update({
      status,
      updatedBy: updater
    }, { transaction })

    if (status === RECEIPT_STATUS.COMPLETED) {
      const productIds = receipt.receiptDetails.map((detail) => detail.ProductId)

      const products = await db.Product.findAll({
        where: { id: productIds },
        transaction,
      })

      const productMap = new Map(products.map((p) => [p.id, p]))

      for (const detail of receipt.receiptDetails) {
        const product = productMap.get(detail.ProductId)
        product.stock = product.stock + detail.quantity
        await product.save({ transaction })
      }
    }

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteReceipt = async (id) => {
  const transaction = await db.sequelize.transaction()
  const receipt = await db.InventoryReceipt.findByPk(id, {
    include: [{ model: db.InventoryReceiptDetail, as: 'receiptDetails' }]
  })

  if (!receipt) {
    throw new ServiceException('Receipt not found', STATUS_CODE.NOT_FOUND)
  }

  try {
    for (const detail of receipt.receiptDetails) {
      await db.Batch.destroy({
        where: { id: detail.batchId },
        transaction
      })
    }

    await db.InventoryReceiptDetail.destroy({
      where: { receiptId: id },
      transaction
    })

    await receipt.destroy({ transaction })

    await transaction.commit()
    return true
  } catch (err) {
    await transaction.rollback()
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const generateReceiptCode = async (receiptType) => {
  const prefix = receiptType === RECEIPT_TYPE.IMPORT ? 'PN' : 'PX'
  const dateStr = moment().format('YYYYMMDD')

  const today = moment().startOf('day').toDate()
  const tomorrow = moment().add(1, 'day').startOf('day').toDate()

  const count = await db.InventoryReceipt.count({
    where: {
      createdAt: {
        [Op.gte]: today,
        [Op.lt]: tomorrow
      }
    }
  })

  const sequence = String(count + 1).padStart(3, '0')
  return `${prefix}-${dateStr}-${sequence}`
}

const getAvailableBatches = async (productId, { transaction } = {}) => {
  return await db.Batch.findAll({
    where: {
      productId,
      quantity: { [db.Sequelize.Op.gt]: 0 },
      expDate: { [db.Sequelize.Op.gte]: new Date() }
    },
    include: [
      {
        model: db.InventoryReceiptDetail,
        as: 'batchReceipt',
        include: [
          {
            model: db.InventoryReceipt,
            as: 'receipt',
            where: {
              status: RECEIPT_STATUS.COMPLETED
            },
            required: true
          }
        ]
      }
    ],
    order: [['expDate', 'ASC']]
  }, { transaction })
}

const ReceiptService = {
  getAllReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  updateReceiptStatus,
  deleteReceipt,
  getAvailableBatches
}

module.exports = ReceiptService
