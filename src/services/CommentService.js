const db = require('../models')
const NotFoundException = require('../exceptions/NotFoundException')
const { COMMENT_ABLE_TYPE } = require('../constants')
const BASE_STATUS = require('../constants/status')

const findComment = async (id, ableType = null) => {
  const conditions = { id }
  if (ableType) {
    conditions.ableType = ableType
  }
  const comment = await db.Comment.findOne({
    where: conditions
  })
  if (!comment) {
    throw new NotFoundException('Không tìm thấy bình luận.')
  }
  return comment
}

const findPost = async (id) => {
  const post = await db.Post.findByPk(id)
  if (!post) {
    throw new NotFoundException('Không tìm thấy bài viết.')
  }
  return post
}

const findProduct = async (id) => {
  const product = await db.Product.findByPk(id)
  if (!product) {
    throw new NotFoundException('Không tìm thấy sản phẩm.')
  }
  return product
}

const createComment = async (data, userId) => {
  const { ableId, ableType, parentId, replyTo, content } = data

  const comment = parentId ? await db.Comment.findOne({
    where: { id: parentId },
  }) : null

  const replyParentId = comment?.parentId !== null ? comment?.parentId : comment?.id

  const transaction = await db.sequelize.transaction()
  try {
    const comment = await db.Comment.create(
      {
        ableId,
        ableType,
        userId,
        content,
        parentId: replyParentId,
        replyTo,
        createdBy: userId
      },
      {
        transaction
      }
    )
    await transaction.commit()
    return comment
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updateComment = async (id, userId, content) => {
  const comment = await findComment(id)

  const transaction = await db.sequelize.transaction()
  try {
    await comment.update(
      {
        content
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

const updateCommentStatus = async (id, status, updatedBy) => {
  const comment = await findComment(id)
  const transaction = await db.sequelize.transaction()

  try {
    await comment.update(
      {
        status,
        updatedBy
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

const deleteComment = async (id) => {
  const comment = await findComment(id)

  const transaction = await db.sequelize.transaction()
  try {
    await comment.destroy({ transaction })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const commonComment = async ({ userId, ableId, ableType, type = null }) => {
  const conditions = {
    ableType: ableType
  }

  if (userId) {
    conditions.userId = userId
  }
  if (ableId) {
    conditions.ableId = ableId
    ableType === COMMENT_ABLE_TYPE.POST ? await findPost(ableId) : await findProduct(ableId)
  }
  if (type === BASE_STATUS.ACTIVE) {
    conditions.status = BASE_STATUS.ACTIVE
  }

  const ableInclude = ableType === COMMENT_ABLE_TYPE.POST ? {
    model: db.Post,
    as: 'post',
    attributes: ['id', 'title', 'slug'],
    include: {
      model: db.Topic,
      as: 'topics',
      attributes: ['id', 'name', 'slug']
    }
  }
    : {
      model: db.Product,
      as: 'product',
      attributes: ['id', 'name', 'slug'],
      include: {
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name']
      }
    }

  return await db.Comment.findAll({
    where: conditions,
    include: [
      ableInclude,
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'full_name', 'avatar_url']
      },
      {
        model: db.User,
        as: 'replyToUser',
        attributes: ['id', 'full_name', 'avatar_url']
      },
    ],
    attributes: { exclude: ['deletedAt'] },
    order: [['createdAt', 'DESC']]
  })
}

const commonPublicComment = async ({ userId, ableId, ableType, type = null }) => {
  const conditions = {
    parentId: null,
    ableType: ableType
  }

  const ableInclude = ableType === COMMENT_ABLE_TYPE.POST ? {
    model: db.Post,
    as: 'post',
    attributes: ['id', 'title', 'slug'],
    include: {
      model: db.Topic,
      as: 'topics',
      attributes: ['id', 'name', 'slug']
    }
  }
    : {
      model: db.Product,
      as: 'product',
      attributes: ['id', 'name', 'slug'],
      include: {
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name']
      }
    }

  const repliesConditions = {}

  if (userId) {
    conditions.userId = userId
  }
  if (ableId) {
    conditions.ableId = ableId
    ableType === COMMENT_ABLE_TYPE.POST ? await findPost(ableId) : await findProduct(ableId)
  }
  if (type === BASE_STATUS.ACTIVE) {
    conditions.status = BASE_STATUS.ACTIVE
    repliesConditions.status = BASE_STATUS.ACTIVE
  }

  return await db.Comment.findAll({
    where: conditions,
    include: [
      ableInclude,
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'full_name', 'avatar_url']
      },
      {
        model: db.User,
        as: 'replyToUser',
        attributes: ['id', 'full_name', 'avatar_url']
      },
      {
        model: db.Comment,
        as: 'replies',
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'full_name', 'avatar_url']
          },
          {
            model: db.User,
            as: 'replyToUser',
            attributes: ['id', 'full_name', 'avatar_url']
          }
        ],
        where: repliesConditions,
        required: false
      }
    ],
    order: [
      ['createdAt', 'ASC'],
      [{
        model: db.Comment,
        as: 'replies'
      }, 'createdAt', 'ASC']
    ]
  })
}

const getComments = async (userId, ableType, ableId) => {
  return await commonComment({ userId, ableId, ableType })
}

const getPublicComments = async (userId, ableType, ableId) => {
  return await commonPublicComment({ userId, ableId, ableType, type: BASE_STATUS.ACTIVE })
}

module.exports = {
  createComment,
  updateComment,
  updateCommentStatus,
  deleteComment,
  getComments,
  getPublicComments,
  findComment,
  findPost,
  findProduct
}
