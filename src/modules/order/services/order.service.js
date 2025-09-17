const { Op } = require('sequelize')
const db = require('../../../models')
const { ORDER_STATUS, PAYMENT_STATUS, STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const DiscountService = require('../../discount/services/discount.service')
const convertDateFormat = require('../../../utils/ConvertDateFormat')
const UserService = require('../../../services/UserService')
const PERMISSIONS = require('../../../constants/permission')
const AUTH_PROVIDER = require('../../../constants/auth-provider')
const generatePassword = require('../../../utils/GenerateRandomPassword')
const transporter = require('../../../config/mail')
const formatCurrency = require('../../../utils/FormatCurrency')

const orderDetail = [
  {
    model: db.Payment,
    as: 'payments'
  },
  {
    model: db.Shipping,
    as: 'shippings'
  },
  {
    model: db.User,
    as: 'customer',
    attributes: ['id', 'full_name', 'email', 'phone_number', 'avatar_url', 'address']
  },
  {
    model: db.User,
    as: 'user',
    attributes: ['id', 'full_name', 'email', 'phone_number', 'avatar_url', 'address']
  },
  {
    model: db.OrderDetail,
    as: 'orderItems',
    include: [
      {
        model: db.ProductVariant,
        as: 'productVariant',
        include: [
          {
            model: db.Product,
            as: 'product',
            attributes: ['id', 'name', 'sku', 'slug']
          }
        ]
      }
    ]
  }
]

const ordersMapping = (orders) => {
  orders.forEach((order) => {
    order?.orderItems?.forEach((item) => {
      try {
        item.attributes = item.attributes ? JSON.parse(item.attributes) : []
      } catch (error) {
        console.error('Lỗi parse JSON attributes:', error)
        item.attributes = []
      }
    })
  })

  return orders
}

const checkOrderPermission = async (userId, permissionName) => {
  const { roles = [] } = (await UserService.getUserById({ id: userId })) || {}
  const permissions = roles[0]?.permissions?.map((p) => p.name) || []
  return permissions.includes(permissionName)
}

const getOrders = async ({ fromDate, toDate, userId, customerId, status, shippingStatus, page = 1, limit = 9999 }) => {
  const offset = (page - 1) * limit
  const conditions = {}

  if (fromDate && toDate) {
    const { startDate, endDate } = convertDateFormat(fromDate, toDate)
    conditions.createdAt = {
      [Op.between]: [startDate, endDate]
    }
  }
  if (userId) {
    conditions.userId = userId
  }
  if (customerId) {
    conditions.customerId = customerId
  }
  if (status) {
    conditions.status = status
  }

  const include = [...orderDetail]
  if (shippingStatus) {
    include.push({
      model: db.Shipping,
      as: 'shippings',
      where: { shippingStatus },
      required: true
    })
  }

  const { count, rows: orders } = await db.Order.findAndCountAll({
    limit,
    offset,
    where: conditions,
    include,
    attributes: { exclude: ['deletedAt'] },
    order: [['createdAt', 'DESC']],
    distinct: true
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    orders: ordersMapping(orders)
  }
}

const getOrdersByDate = async (data) => {
  const { id: userId, fromDate, toDate, page, limit, status, shippingStatus } = data

  const isViewOrder = await checkOrderPermission(userId, PERMISSIONS.ORDER_VIEW)

  return await getOrders({
    fromDate,
    toDate,
    status,
    shippingStatus,
    page,
    limit,
    ...(isViewOrder ? {} : { userId })
  })
}

const getOrderByCustomer = async (data) => {
  const { id: customerId, fromDate, toDate, page, limit, status, shippingStatus } = data
  return await getOrders({ customerId, fromDate, toDate, status, shippingStatus, page, limit })
}


const createNewUserAndAddress = async (name, phone, email, address) => {
  const existingUser = await UserService.getUserByEmail({ email })

  if (existingUser) return existingUser

  const transaction = await db.sequelize.transaction()
  try {
    const user = await db.User.create(
      {
        full_name: name,
        phone_number: phone,
        email,
        address,
        username: email,
        password: generatePassword()
      },
      { transaction }
    )
    await db.UserAddress.create(
      {
        userId: user.id,
        name,
        phone,
        email,
        address
      },
      { transaction }
    )
    await transaction.commit()
    return user
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException({ userId: error.message }, STATUS_CODE.NOT_FOUND)
  }
}

// Thêm import
const { CustomerGroupDiscount } = db

const createOrder = async (data) => {
  const defaultStatus = ORDER_STATUS.PENDING
  const paymentStatus = PAYMENT_STATUS.UNPAID
  const now = new Date()

  const orderCode = await generateOrderCode()
  const trackingNumber = await generateTrackingNumber()

  let {
    customerId = null,
    note,
    items,
    shippingMethod,
    customerName,
    customerPhone,
    customerEmail = null,
    customerAddress,
    paymentMethod,
    discounts,
    orderForDate
  } = data

  let customerGroupId = null
  if (!customerId) {
    if (customerEmail) {
      const user = await db.User.findOne({ where: { email: customerEmail } })
      if (user) {
        if (user.status !== 'active') {
          throw new ServiceException({ email: `Tài khoản có email ${customerEmail} đang bị khóa` }, STATUS_CODE.BAD_REQUEST)
        }
        customerId = user.id
        customerGroupId = user.customerGroupId || null
      } else {
        const newCustomer = await createNewUserAndAddress(customerName, customerPhone, customerEmail, customerAddress)
        customerId = newCustomer.id
        customerGroupId = newCustomer.customerGroupId || null
      }
    }
  } else {
    const user = await db.User.findByPk(customerId)
    customerGroupId = user?.customerGroupId || null
  }

  const productVariants = await db.ProductVariant.findAll({
    where: { id: items.map((item) => item.productVariantId) },
    include: [
      {
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'salePrice', 'originalPrice']
      },
      {
        model: db.AttributeValue,
        as: 'attributeValues',
        include: [{ model: db.Attribute, as: 'attribute', attributes: ['id', 'name'] }]
      }
    ],
    attributes: ['id', 'sku', 'unit', 'originalPrice', 'salePrice']
  })

  const enrichedProductVariants = []
  for (const variant of productVariants) {
    const item = items.find((i) => i.productVariantId === variant.id)
    const quantity = item?.quantity || 0

    let basePrice = Number(variant.salePrice || variant.originalPrice || 0)
    let finalPrice = basePrice

    if (customerGroupId) {
      const activeDiscount = await CustomerGroupDiscount.findOne({
        where: { customerGroupId, productId: variant.product.id, status: 'active' }
      })
      if (activeDiscount) {
        if (activeDiscount.discountType === 'percentage') {
          finalPrice = basePrice - (basePrice * Number(activeDiscount.discountValue)) / 100
        } else if (activeDiscount.discountType === 'fixed') {
          finalPrice = basePrice - Number(activeDiscount.discountValue)
        }
        if (finalPrice < 0) finalPrice = 0
      }
    }

    const subTotal = finalPrice * quantity
    enrichedProductVariants.push({
      ...variant.toJSON(),
      quantity,
      subTotal,
      productId: variant.productId,
      appliedPrice: finalPrice
    })
  }

  const subTotal = enrichedProductVariants.reduce((sum, p) => sum + p.subTotal, 0)

  const discountResponse = discounts?.length > 0
    ? await DiscountService.applyDiscount({ codes: discounts, items })
    : null

  const totalAmount = discountResponse ? discountResponse.finalTotal : subTotal

  const transaction = await db.sequelize.transaction()
  try {
    const order = await db.Order.create(
      {
        code: orderCode,
        customerId,
        subTotal,
        discountAmount: discountResponse?.discountAmount || 0,
        totalAmount,
        status: defaultStatus,
        paymentStatus,
        date: now,
        orderForDate,
        note,
        createdBy: customerId
      },
      { transaction }
    )

    for (const item of enrichedProductVariants) {
      const { id, sku, product, unit, quantity, appliedPrice, originalPrice, attributeValues } = item
      const totalPrice = Number(quantity) * Number(appliedPrice)

      await order.createOrderItem(
        {
          productVariantId: id,
          productSku: sku || '',
          productName: product?.name,
          productUnit: unit || '',
          quantity,
          salePrice: appliedPrice,
          originalPrice,
          totalPrice,
          attributes: JSON.stringify(attributeValues)
        },
        { transaction }
      )
    }

    await order.createShipping(
      { trackingNumber, shippingMethod, customerName, customerPhone, customerAddress },
      { transaction }
    )

    await order.createPayment(
      { paymentMethod, amount: totalAmount, paymentStatus },
      { transaction }
    )

    if (discountResponse) {
      for (const discountItem of discountResponse?.appliedDiscounts) {
        await db.OrderDiscount.create(
          {
            discountId: discountItem.id,
            orderId: order.id,
            discountAmount: discountItem.discountAmount
          },
          { transaction }
        )
        const discount = await db.Discount.findByPk(discountItem.id)
        await discount.update({ usedCount: discount.usedCount + 1 }, { transaction })
      }
    }

    await transaction.commit()
    return await findOrder({ id: order.id, detail: true })
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}


const findOrder = async ({ id, detail = false, userId = null }) => {
  const conditions = { id }
  const orderInclude = detail ? orderDetail : []

  if (userId) conditions.customerId = userId

  const order = await db.Order.findOne({
    where: conditions,
    include: orderInclude,
    attributes: { exclude: ['deletedAt'] }
  })
  if (!order) {
    throw new ServiceException({
      order: 'Không tìm thấy hóa đơn.'
    })
  }
  return order
}

const updateOrderStatusById = async (id, data, { id: updater }) => {
  const { status } = data
  const order = await findOrder({ id, detail: true })

  const transaction = await db.sequelize.transaction()
  try {
    await order.update(
      {
        status,
        userId: updater,
        updatedBy: updater,
      },
      { transaction }
    )

    if (status === ORDER_STATUS.ACCEPTED && order.customerId) {
      const rules = await db.RewardPointRule.findAll({
        where: { status: 'active' },
      })

      let totalPoints = 0

      const valueRules = rules.filter((r) => r.type === 'order_value')
      if (valueRules.length > 0) {
        const matchedValueRule = valueRules
          .filter((r) => order.totalAmount >= Number(r.minOrderValue || 0))
          .sort((a, b) => Number(b.minOrderValue) - Number(a.minOrderValue))[0]
        if (matchedValueRule) {
          totalPoints += Number(matchedValueRule.points || 0)
          await db.RewardPointHistory.create(
            {
              userId: order.customerId,
              orderId: order.id,
              ruleType: matchedValueRule.type,
              minOrderValue: matchedValueRule.minOrderValue,
              points: matchedValueRule.points,
            },
            { transaction }
          )
        }
      }

      const timeRules = rules.filter((r) => r.type === 'time_slot')
      if (timeRules.length > 0 && order.orderForDate) {
        const createdAt = new Date(order.createdAt)
        const targetDate = new Date(order.orderForDate)

        let matchedTimeRule = null

        if (createdAt.toDateString() === targetDate.toDateString()) {
          const validRules = timeRules.filter((r) => {
            if (!r.beforeTime) return false
            const [hh, mm] = r.beforeTime.split(':')
            const cutoff = new Date(createdAt)
            cutoff.setHours(Number(hh), Number(mm), 0, 0)
            return createdAt <= cutoff
          })
          matchedTimeRule =
            validRules.sort(
              (a, b) =>
                new Date(`1970-01-01T${a.beforeTime}:00`) -
                new Date(`1970-01-01T${b.beforeTime}:00`)
            )[0] || null
        } else if (createdAt < targetDate) {
          matchedTimeRule = timeRules.sort(
            (a, b) => Number(b.points) - Number(a.points)
          )[0]
        }

        if (matchedTimeRule) {
          totalPoints += Number(matchedTimeRule.points || 0)
          await db.RewardPointHistory.create(
            {
              userId: order.customerId,
              orderId: order.id,
              ruleType: matchedTimeRule.type,
              beforeTime: matchedTimeRule.beforeTime,
              points: matchedTimeRule.points,
            },
            { transaction }
          )
        }
      }

      if (totalPoints > 0) {
        await db.User.increment(
          { rewardPoints: totalPoints },
          { where: { id: order.customerId }, transaction }
        )
      }
    }

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}


const updateOrderPaymentStatusById = async (data, { id: updater }) => {
  const { id, paymentStatus } = data
  const order = await findOrder({ id })
  if (order.paymentStatus === PAYMENT_STATUS.SUCCESS) {
    throw new ServiceException({
      status: 'Trạng thái thanh toán thành công, không thể cập nhật.'
    })
  }
  if (order.paymentStatus === PAYMENT_STATUS.FAILED) {
    throw new ServiceException({
      status: 'Trạng thái thanh toán đã hủy, không thể cập nhật.'
    })
  }
  const payment = await db.Payment.findOne({
    where: { orderId: order.id }
  })

  const transaction = await db.sequelize.transaction()
  try {
    await order.update(
      {
        paymentStatus,
        updatedBy: updater
      },
      { transaction }
    )
    await payment.update(
      {
        status: paymentStatus
      },
      { transaction }
    )

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const deleteOrderById = async (id) => {
  const order = await db.Order.findByPk(id)

  if (!order) {
    throw new ServiceException('Hóa đơn không tồn tại.', STATUS_CODE.NOT_FOUND)
  }

  if (order.status === ORDER_STATUS.ACCEPTED) {
    throw new ServiceException('Hóa đơn đã được xác nhận, không thể xóa.')
  }

  try {
    return await order.destroy()
  } catch (error) {
    throw new Error(error.message)
  }
}

const generateOrderCode = async () => {
  const prefix = 'ORDER'
  const year = new Date().getFullYear()
  let nextCode = 1
  let newOrderCode

  while (true) {
    newOrderCode = `${prefix}/${year}/${nextCode.toString().padStart(4, '0')}`
    const existingCode = await db.Order.findOne({
      where: {
        code: newOrderCode
      },
      paranoid: false
    })
    if (!existingCode) {
      break
    }
    nextCode++
  }

  return newOrderCode
}

const generateTrackingNumber = async () => {
  const prefix = 'SHOP-TRACK'
  const year = new Date().getFullYear()
  let nextCode = 1
  let newOrderCode

  while (true) {
    newOrderCode = `${prefix}/${year}/${nextCode.toString().padStart(4, '0')}`
    const existingCode = await db.Shipping.findOne({
      where: {
        trackingNumber: newOrderCode
      }
    })
    if (!existingCode) {
      break
    }
    nextCode++
  }

  return newOrderCode
}

const getOrderDetail = async (id, data) => {
  const { userId } = data
  const isViewOrderDetail = await checkOrderPermission(userId, PERMISSIONS.ORDER_DETAIL)

  return isViewOrderDetail ? await findOrder({ id, detail: true }) : await findOrder({ id, detail: true, userId })
}

const assignOrderTo = async (orderId, userId) => {
  const order = await findOrder({ id: orderId })
  const findUser = await db2.User.findOne({
    where: {
      id: userId,
      user_type: {
        [Op.ne]: AUTH_PROVIDER.CUSTOMER
      }
    }
  })

  if (!findUser) {
    throw new ServiceException({
      userId: 'Không tìm thấy người dùng.'
    })
  }
  const transaction = await db.sequelize.transaction()
  try {
    await order.update(
      {
        userId
      },
      { transaction }
    )
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const sendOrderEmail = async (order) => {
  try {
    const { orderItems } = order

    const html = `
    <h1 style="text-align: center;">Thông tin đặt hàng</h1>
    <p>Mã đơn hàng: ${order?.code || ''}</p>
    <p>Ngày tạo: ${order?.date ? new Date(order?.date).toLocaleDateString('vi-VN') : ''}</p>
    <p>Trạng thái: ${order?.status === 'pending' ? 'Chờ xác nhận' : order?.status === 'accepted' ? 'Đã xác nhận' : order?.status === 'rejected' ? 'Đã hủy' : order?.status}</p>
    <p>Thanh toán: ${order?.paymentStatus === 'unpaid' ? 'Chờ thanh toán' : order?.paymentStatus === 'success' ? 'Đã thanh toán' : order?.paymentStatus === 'failed' ? 'Đã hủy' : order?.paymentStatus}</p>
    <p>Tổng tiền: ${formatCurrency(order?.totalAmount || 0)}</p>
    <p>Tên khách hàng: ${order?.shippings?.[0]?.customerName || ''}</p>
    <p>Số điện thoại: ${order?.shippings?.[0]?.customerPhone || ''}</p>
    <p>Email: ${order?.customer?.email || ''}</p>
    <p>Địa chỉ: ${order?.shippings?.[0]?.customerAddress || ''}</p>
    <p>Chi tiết đơn hàng:</p>
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; border-spacing: 0;">
      <tr style="background-color: #f0f0f0;">
        <td style="padding: 10px; border: 1px solid #000; text-align: center;">Tên sản phẩm</td>
        <td style="padding: 10px; border: 1px solid #000; text-align: center;">Số lượng</td>
        <td style="padding: 10px; border: 1px solid #000; text-align: center;">Đơn giá</td>
        <td style="padding: 10px; border: 1px solid #000; text-align: center;">Thành tiền</td>
      </tr>
      ${orderItems
        .map(
          (item) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #000;">${item.productName}</td>
          <td style="padding: 10px; border: 1px solid #000; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border: 1px solid #000; text-align: right;">${formatCurrency(item.salePrice)}</td>
          <td style="padding: 10px; border: 1px solid #000; text-align: right;">${formatCurrency(item.totalPrice)}</td>
        </tr>
      `
        )
        .join('')}
    </table>
    <p>Tổng tiền: ${formatCurrency(order.totalAmount)}</p>
    `
    const users = await db.User.findAll({
      where: {
        email: {
          [Op.not]: null
        },
        user_type: AUTH_PROVIDER.ADMIN
      },
      attributes: ['email']
    })

    return await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: users.map((user) => user.email),
      subject: `Thông tin đơn hàng ${order?.code || ''}`,
      html
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

const getPurchaseSummary = async ({ fromDate, toDate, status, shippingStatus, userId, customerId, type }) => {
  try {

    const conditions = {}

    if (fromDate && toDate) {
      const { startDate, endDate } = convertDateFormat(fromDate, toDate)
      conditions.createdAt = { [Op.between]: [startDate, endDate] }
    }
    if (userId) conditions.userId = userId
    if (customerId && type == "customer_orders") conditions.customerId = customerId
    if (status) conditions.status = status

    const include = [
      {
        model: db.OrderDetail,
        as: 'orderItems',
        include: [
          {
            model: db.ProductVariant,
            as: 'productVariant',
            include: [
              { model: db.Product, as: 'product', attributes: ['id', 'name', 'sku', 'slug'] }
            ]
          }
        ]
      }
    ]

    if (shippingStatus) {
      include.push({
        model: db.Shipping,
        as: 'shippings',
        where: { shippingStatus },
        required: true
      })
    }

    const orders = await db.Order.findAll({
      where: conditions,
      include,
      attributes: ['id', 'code', 'createdAt'],
      order: [['createdAt', 'DESC']]
    })

    const summaryMap = {}
    orders.forEach(order => {
      order.orderItems?.forEach(item => {
        const key = item.productVariant?.product?.id || item.productVariantId
        if (!summaryMap[key]) {
          summaryMap[key] = {
            productId: item.productVariant?.product?.id,
            productName: item.productVariant?.product?.name || item.productName,
            productSku: item.productVariant?.product?.sku || item.productSku,
            unit: item.productUnit,
            totalQuantity: 0,
            totalAmount: 0,
            orders: []
          }
        }
        summaryMap[key].totalQuantity += Number(item.quantity)
        summaryMap[key].totalAmount += Number(item.totalPrice)
        summaryMap[key].orders.push({
          orderId: order.id,
          code: order.code,
          createdAt: order.createdAt,
          quantity: item.quantity,
          salePrice: item.salePrice,
          totalPrice: item.totalPrice
        })
      })
    })

    return Object.values(summaryMap)
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.SERVER_ERROR)
  }
}



module.exports = {
  getOrdersByDate,
  getOrderByCustomer,
  assignOrderTo,
  createOrder,
  updateOrderStatusById,
  updateOrderPaymentStatusById,
  deleteOrderById,
  getOrderDetail,
  sendOrderEmail,
  getPurchaseSummary
}
