const { Op } = require('sequelize')
const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')

const updateProductVariant = async (id, data) => {
  const { sku, originalPrice, salePrice, stock, position, status, imageUrl } = data

  const productVariant = await db.ProductVariant.findOne({
    where: {
      id
    }
  })

  if (!productVariant) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const isExistedSku = await db.ProductVariant.findOne({
    where: {
      sku,
      id: { [Op.ne]: id }
    }
  })

  if (isExistedSku) {
    throw new ServiceException({ sku: message.isExisted }, STATUS_CODE.UNPROCESSABLE_ENTITY)
  }

  try {
    await productVariant.update({
      sku,
      originalPrice,
      salePrice,
      stock,
      position,
      status,
      imageUrl
    })
    return true
  } catch (error) {
    throw new ServiceException(error.message, error.status)
  }
}

const deleteProductVariant = async (id) => {
  const productVariant = await db.ProductVariant.findOne({
    where: {
      id
    }
  })

  if (!productVariant) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  try {
    await productVariant.destroy()
    return true
  } catch (error) {
    throw new ServiceException(error.message, error.status)
  }
}

module.exports = {
  updateProductVariant,
  deleteProductVariant
}
