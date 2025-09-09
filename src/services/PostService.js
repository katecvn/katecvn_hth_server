const db = require('../models')
const BASE_STATUS = require('../constants/status')
const { Op } = require('sequelize')
const PERMISSIONS = require('../constants/permission')

const postInclude = [
  {
    model: db.Topic,
    as: 'topics'
  },
  {
    model: db.User,
    attributes: { exclude: ['password'] },
    as: 'author'
  }
]

const findPost = async (id) => {
  return await db.Post.findByPk(id)
}

const getPosts = async ({ page = 1, limit = 10, ids, keyword, topicId, topicSlug, sort = 'desc' }, status = undefined) => {
  const offset = (page - 1) * limit
  const conditions = {}
  const commentConditions = {}
  const topicConditions = {}

  if (ids) {
    conditions.id = { [db.Sequelize.Op.in]: ids.split(',').map(Number) }
  }

  if (keyword) {
    conditions[db.Sequelize.Op.or] = [{ title: { [db.Sequelize.Op.like]: `%${keyword}%` } }, { content: { [db.Sequelize.Op.like]: `%${keyword}%` } }]
  }

  if (status) {
    conditions.status = BASE_STATUS.PUBLISHED
    commentConditions.status = BASE_STATUS.ACTIVE
    topicConditions.status = BASE_STATUS.ACTIVE
  }

  if (topicId) {
    if (status === BASE_STATUS.ACTIVE) {
      const topic = await db.Topic.findOne({
        where: {
          id: topicId,
          status: status
        }
      })
      if (!topic) {
        topicId = null
      }
    }
    conditions.id = {
      [Op.in]: db.Sequelize.literal(`(SELECT post_id FROM PostHasTopics WHERE topic_id = :topicId)`)
    }
  }

  if (topicSlug) {
    if (status === BASE_STATUS.ACTIVE) {
      const topic = await db.Topic.findOne({
        where: {
          slug: topicSlug,
          status: status
        }
      })
      if (!topic) {
        return {
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          posts: []
        }
      }
      conditions.id = {
        [Op.in]: db.Sequelize.literal(`(SELECT post_id FROM PostHasTopics WHERE topic_id = ${topic.id})`)
      }
    }
  }

  const { count, rows: posts } = await db.Post.findAndCountAll({
    limit,
    offset,
    where: conditions,
    attributes: {
      exclude: ['content']
    },
    include: [
      {
        model: db.Topic,
        as: 'topics',
        where: topicConditions,
        required: false
      },
      {
        model: db.User,
        attributes: { exclude: ['password'] },
        as: 'author'
      }
    ],
    distinct: true,
    replacements: { topicId },
    order: [['id', sort]]
  })

  posts.forEach((post) => {
    post.imagesUrl = post.imagesUrl ? JSON.parse(JSON.parse(post.imagesUrl)) : []
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    posts
  }
}

const getPostById = async (id) => {
  return await db.Post.findByPk(id, {
    include: postInclude
  })
}

const getPostBySlug = async (slug) => {
  return await db.Post.findOne({
    where: {
      slug,
      status: BASE_STATUS.PUBLISHED
    },
    attributes: { exclude: ['deletedAt'] },
    include: [
      {
        model: db.Topic,
        as: 'topics',
        where: {
          status: BASE_STATUS.ACTIVE
        },
        required: false
      },
      {
        model: db.User,
        attributes: ['id', 'code', 'full_name', 'email'],
        as: 'author'
      },
      {
        model: db.Comment,
        attributes: ['id', 'userId', 'content', 'parentId', 'status'],
        as: 'postComments',
        include: [
          {
            model: db.User,
            attributes: ['id', 'code', 'full_name', 'email'],
            as: 'user'
          }
        ],
        where: {
          status: BASE_STATUS.ACTIVE
        },
        required: false
      }
    ]
  })
}

const createPost = async (
  { title, slug, shortDescription, content, thumbnail, meta_title, meta_description, meta_keywords, topics },
  createdBy,
  permissions
) => {
  const hasUserApprovePost = permissions.includes(PERMISSIONS.POST_STATUS)

  const status = hasUserApprovePost ? BASE_STATUS.ACTIVE : BASE_STATUS.PENDING

  const transaction = await db.sequelize.transaction()
  try {
    const post = await db.Post.create(
      {
        author_id: createdBy,
        title,
        slug,
        short_description: shortDescription,
        content,
        thumbnail,
        status,
        meta_title,
        meta_description,
        meta_keywords
      },
      {
        transaction
      }
    )
    for (const topic of topics) {
      await post.createPostHasTopic(
        {
          post_id: post.id,
          topic_id: topic
        },
        { transaction }
      )
    }
    await transaction.commit()
    return post
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updatePost = async (id, data) => {
  const { title, slug, shortDescription, content, thumbnail, meta_title, meta_description, meta_keywords, topics } = data

  const post = await findPost(id)

  const dataUpdate = {
    title,
    slug,
    short_description: shortDescription,
    content,
    thumbnail,
    meta_title,
    meta_description,
    meta_keywords
  }
  const transaction = await db.sequelize.transaction()
  try {
    await post.update(dataUpdate, { transaction })

    await db.PostHasTopic.destroy({ where: { post_id: id } }, { transaction })

    for (const topic of topics) {
      await db.PostHasTopic.create(
        {
          post_id: post.id,
          topic_id: topic
        },
        { transaction }
      )
    }

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updatePostStatus = async (data) => {
  const { id, status } = data
  const post = await findPost(id)
  const dataUpdate = {
    status
  }
  if (status === BASE_STATUS.PUBLISHED && !post.published_at) {
    dataUpdate.published_at = new Date()
  }

  const transaction = await db.sequelize.transaction()
  try {
    await post.update(dataUpdate, { transaction })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const deletePostById = async (id) => {
  const post = await findPost(id)

  try {
    await post.destroy()
    return true
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  getPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePostById,
  updatePostStatus
}
