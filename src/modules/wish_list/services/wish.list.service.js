const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')

const getWishListByUser = async (userId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit
  const { rows: wishlists, count } = await db.WishList.findAndCountAll({
    where: {
      userId
    },
    include: [
      {
        model: db.Product,
        as: 'product'
      }
    ],
    distinct: true,
    limit,
    offset
  })

  wishlists.forEach((wishlist) => {
    wishlist.product.imagesUrl = (wishlist.product.imagesUrl && JSON.parse(wishlist.product.imagesUrl)) || []
  })

  return {
    totalItems: count,
    currentPage: page,
    totalPage: Math.ceil(count / limit),
    wishlists
  }
}

const addToWishList = async (userId, productId) => {
  const existingProduct = await db.WishList.findOne({
    where: { productId, userId }
  })

  if (existingProduct) {
    throw new ServiceException({
      message: 'Sản phẩm đã được thêm vào yêu thích'
    })
  }

  const transaction = await db.sequelize.transaction()
  try {
    await db.WishList.create(
      {
        productId,
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

const removeFromWishList = async (userId, productId) => {
  const existingProduct = await db.WishList.findOne({
    where: {
      productId,
      userId
    }
  })

  if (!existingProduct) {
    throw new ServiceException({
      message: 'Không tìm thấy sản phẩm'
    })
  }

  const transaction = await db.sequelize.transaction()
  try {
    await existingProduct.destroy({ transaction })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const WishListService = {
  getWishListByUser,
  addToWishList,
  removeFromWishList
}

module.exports = WishListService
