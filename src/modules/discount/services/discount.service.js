const db = require('../../../models')
const { DISCOUNT_TYPE, DISCOUNT_STATUS, STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const { Op } = require('sequelize')
const convertDateFormat = require('../../../utils/ConvertDateFormat')
const { message } = require('../../../constants/message')

const getDiscounts = async ({ page = 1, limit = 10, fromDate, toDate, ids }) => {
  offset = (page - 1) * limit
  const conditions = {}

  if (fromDate && toDate) {
    const { startDate, endDate } = convertDateFormat(fromDate, toDate)
    conditions.endDate = {
      [Op.between]: [startDate, endDate]
    }
  }

  if (ids) {
    const idsMap = ids.split(',').map(Number)
    conditions.id = { [Op.in]: idsMap }
  }

  const { count, rows: discounts } = await db.Discount.findAndCountAll({
    limit,
    offset,
    where: conditions,
    include: [
      {
        model: db.ProductVariant,
        as: 'productVariants',
        include: [
          {
            model: db.Product,
            as: 'product',
            attributes: ['id', 'name', 'stock', 'sku', 'unit', 'categoryId', 'brandId', 'slug', 'imagesUrl'],
            include: [
              { model: db.Category, as: 'category', attributes: ['id', 'name', 'thumbnail'] },
              { model: db.Brand, as: 'brand', attributes: ['id', 'name', 'imageUrl'] }
            ]
          }
        ]
      },
      {
        model: db.ProductDiscount,
        as: 'discountProducts'
      }
    ],
    attributes: {
      exclude: ['deletedAt']
    },
    distinct: true
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    discounts
  }
}

const getDiscountById = async (id) => {
  const discount = await db.Discount.findByPk(id, {
    include: [
      {
        model: db.ProductVariant,
        as: 'productVariants',
        include: [
          {
            model: db.Product,
            as: 'product',
            attributes: ['id', 'name', 'stock', 'sku', 'unit', 'categoryId', 'brandId', 'slug', 'imagesUrl'],
            include: [
              { model: db.Category, as: 'category', attributes: ['id', 'name', 'thumbnail'] },
              { model: db.Brand, as: 'brand', attributes: ['id', 'name', 'imageUrl'] }
            ]
          }
        ]
      }
    ]
  })

  if (!discount) {
    throw new ServiceException({ id: message.notFound }, STATUS_CODE.NOT_FOUND)
  }

  return discount
}

const createDiscount = async (data) => {
  const { code, type, value, minOrderAmount, maxDiscount, startDate, endDate, usageLimit, productVariantIds = [], creator } = data

  const transaction = await db.sequelize.transaction()
  try {
    const discount = await db.Discount.create(
      {
        code,
        type,
        value,
        minOrderAmount,
        maxDiscount,
        startDate,
        endDate,
        usageLimit,
        createdBy: creator
      },
      { transaction }
    )

    if (productVariantIds.length) {
      for (const variantId of productVariantIds) {
        await db.ProductDiscount.create(
          {
            productVariantId: variantId,
            discountId: discount.id
          },
          { transaction }
        )
      }
    }

    await transaction.commit()
    return discount
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updateDiscountById = async (id, data) => {
  const { code, type, value, minOrderAmount, maxDiscount, startDate, endDate, usageLimit, status, productVariantIds = [], updater } = data

  const discount = await db.Discount.findByPk(id)

  const productDiscounts = await db.ProductDiscount.findAll({
    where: {
      discountId: id
    }
  })

  const currentVariantIds = productDiscounts.map((item) => item.productVariantId)
  const variantIdsToCreate = productVariantIds.filter((id) => !currentVariantIds.includes(id))
  const variantIdsToDelete = currentVariantIds.filter((id) => !productVariantIds.includes(id))

  const transaction = await db.sequelize.transaction()
  try {
    await discount.update(
      {
        code,
        type,
        value,
        minOrderAmount,
        maxDiscount,
        startDate,
        endDate,
        usageLimit,
        status,
        updatedBy: updater
      },
      { transaction }
    )

    for (const variantId of variantIdsToCreate) {
      await db.ProductDiscount.create({ discountId: id, productVariantId: variantId }, { transaction })
    }

    for (const variantId of variantIdsToDelete) {
      await db.ProductDiscount.destroy({
        where: { discountId: id, productVariantId: variantId },
        transaction
      })
    }

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message, error.status)
  }
}

const updateStatus = async (id, data) => {
  const { status, updater } = data
  const discount = await db.Discount.findByPk(id)

  try {
    await discount.update({
      status,
      updatedBy: updater
    })
    return true
  } catch (error) {
    throw new Error(error.message, error.status)
  }
}

const applyDiscount = async ({ codes, items }) => {
  const now = new Date()

  // Lấy productVariantIds từ items
  const productVariantIds = items.map((item) => item.productVariantId)

  // Lấy ProductVariant, include Product để lấy name
  const productVariants = await db.ProductVariant.findAll({
    where: { id: productVariantIds },
    attributes: ['id', 'sku', 'unit', 'originalPrice', 'salePrice'],
    include: [
      {
        model: db.Product,
        attributes: ['name'],
        as: 'product'
      }
    ]
  })

  if (productVariants.length !== productVariantIds.length) {
    throw new ServiceException({ codes: 'Một hoặc nhiều biến thể sản phẩm không tồn tại.' })
  }

  // Tạo enrichedProductVariants với số lượng, subtotal, discountApplied
  const enrichedProductVariants = productVariants.map((variant) => {
    const item = items.find((item) => item.productVariantId === variant.id)
    const quantity = item.quantity
    const subTotal = variant.salePrice * quantity
    return {
      ...variant.toJSON(),
      productName: variant.Product?.name || '',
      quantity,
      subTotal,
      discountApplied: 0
    }
  })

  const subTotal = enrichedProductVariants.reduce((sum, p) => sum + p.subTotal, 0)
  let totalDiscountAmount = 0
  let discountedItems = [...enrichedProductVariants]
  let appliedDiscounts = []
  const usedCodes = new Set()

  for (const discountCode of codes) {
    const discount = await db.Discount.findOne({
      where: { code: discountCode },
      include: [
        {
          model: db.ProductDiscount,
          as: 'discountProducts'
        }
      ]
    })
    if (!discount) continue
    if (usedCodes.has(discountCode)) continue
    usedCodes.add(discountCode)

    const usageLimit = Number(discount.usageLimit) || 0
    const usedCount = Number(discount.usedCount) || 0
    const minOrderAmount = Number(discount.minOrderAmount) || 0
    const discountValue = Number(discount.value) || 0
    const maxDiscount = Number(discount.maxDiscount) || 0

    if (
      (usageLimit > 0 && usedCount >= usageLimit) ||
      new Date(discount.endDate) < now ||
      new Date(discount.startDate) > now ||
      minOrderAmount > subTotal
    ) {
      continue
    }

    let discountAmount = 0
    // Lưu ý: discount.ProductDiscounts là mảng, trường productVariantId là khóa ngoại
    const applicableVariants = discount.ProductDiscounts?.map((pd) => pd.productVariantId) || []
    const isOrderDiscount = applicableVariants.length === 0

    if (!isOrderDiscount) {
      for (let item of discountedItems) {
        if (applicableVariants.includes(item.id)) {
          const itemTotalPrice = Number(item.salePrice) * Number(item.quantity)
          let itemDiscount = 0

          if (discount.type === DISCOUNT_TYPE.PERCENTAGE) {
            itemDiscount = (itemTotalPrice * discountValue) / 100
            itemDiscount = maxDiscount ? Math.min(itemDiscount, maxDiscount) : itemDiscount
          } else if (discount.type === DISCOUNT_TYPE.FIXED) {
            itemDiscount = discountValue * Number(item.quantity)
          }

          discountAmount += itemDiscount
          item.discountApplied = (Number(item.discountApplied) || 0) + itemDiscount
        }
      }
    } else {
      if (discount.type === DISCOUNT_TYPE.PERCENTAGE) {
        discountAmount = (subTotal * discountValue) / 100
        discountAmount = maxDiscount ? Math.min(discountAmount, maxDiscount) : discountAmount
      } else if (discount.type === DISCOUNT_TYPE.FIXED) {
        discountAmount = discountValue
      }
    }

    totalDiscountAmount += discountAmount
    appliedDiscounts.push({ id: discount.id, discountCode, discountAmount })
  }

  const finalTotal = Math.max(subTotal - totalDiscountAmount, 0)

  return {
    originalTotal: subTotal,
    discountAmount: totalDiscountAmount,
    finalTotal,
    discountedItems,
    appliedDiscounts
  }
}

const deleteById = async (id) => {
  const discount = await db.Discount.findByPk(id)

  try {
    await discount.destroy()
    return true
  } catch (error) {
    throw new Error(error.message, error.status)
  }
}

const getPublicDiscountProducts = async () => {
  return await db.Discount.findAll({
    include: [
      {
        model: db.Product,
        as: 'discountProducts',
        attributes: ['id', 'name', 'stock', 'sku', 'unit', 'categoryId', 'brandId', 'slug', 'imagesUrl'],
        include: [
          { model: db.Category, as: 'category', attributes: ['id', 'name', 'thumbnail'] },
          { model: db.Brand, as: 'brand', attributes: ['id', 'name', 'imageUrl'] }
        ],
        required: true
      }
    ],
    attributes: ['code', 'value', 'minOrderAmount', 'startDate', 'endDate']
  })
}

const getPublicDiscount = async ({ items }) => {
  const now = new Date()
  // Lấy sản phẩm
  const productIds = items.map((item) => item.productId)

  const products = await db.Product.findAll({
    where: { id: productIds },
    attributes: ['id', 'name', 'sku', 'unit', 'originalPrice', 'salePrice']
  })

  const enrichedProducts = products.map((product) => {
    const item = items.find((item) => item.productId === product.id)
    const quantity = item.quantity
    const subTotal = product.salePrice * quantity
    return {
      ...product.toJSON(),
      quantity,
      subTotal
    }
  })

  const subTotal = enrichedProducts.reduce((sum, p) => sum + p.subTotal, 0)

  // Lấy tất cả mã giảm giá đang hoạt động trong thời gian hiện tại
  const discounts = await db.Discount.findAll({
    where: {
      status: DISCOUNT_STATUS.ACTIVE,
      startDate: { [Op.lte]: now },
      endDate: { [Op.gte]: now }
    },
    include: [{ model: db.ProductDiscount, as: 'productDiscounts' }]
  })

  const validDiscounts = []

  for (const discount of discounts) {
    const usageLimit = Number(discount.usageLimit) || 0
    const usedCount = Number(discount.usedCount) || 0
    const minOrderAmount = Number(discount.minOrderAmount) || 0

    if (usageLimit > 0 && usedCount >= usageLimit) {
      continue // Đã hết lượt
    }
    if (minOrderAmount > subTotal) {
      continue // Không đủ giá trị đơn hàng
    }

    const applicableProducts = discount.productDiscounts || []
    const isOrderDiscount = applicableProducts.length === 0

    if (isOrderDiscount) {
      validDiscounts.push(discount)
    } else {
      // Có ít nhất một sản phẩm trong đơn thuộc danh sách được áp dụng
      const hasApplicableItem = enrichedProducts.some((item) => applicableProducts.some((pd) => String(pd.ProductId) === String(item.id)))
      if (hasApplicableItem) {
        validDiscounts.push(discount)
      }
    }
  }

  return validDiscounts
}

module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscountById,
  updateStatus,
  applyDiscount,
  deleteById,
  getPublicDiscountProducts,
  getPublicDiscount
}
