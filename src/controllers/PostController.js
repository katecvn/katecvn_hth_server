const PostService = require('../services/PostService')
const http = require('../utils/http')
const { STATUS_CODE } = require('../constants')
const BASE_STATUS = require('../constants/status')

const getPosts = async (req, res, next) => {
  const query = req.query

  try {
    const posts = await PostService.getPosts(query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, posts)
  } catch (error) {
    next(error)
  }
}

const getPublicPosts = async (req, res, next) => {
  const query = req.query

  try {
    const posts = await PostService.getPosts(query, BASE_STATUS.ACTIVE)
    return http.json(res, 'Thành công', STATUS_CODE.OK, posts)
  } catch (error) {
    next(error)
  }
}

const getPostById = async (req, res, next) => {
  const { id } = req.params
  try {
    const post = await PostService.getPostById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, post)
  } catch (error) {
    next(error)
  }
}

const getPostBySlug = async (req, res, next) => {
  const { slug } = req.params

  try {
    const post = await PostService.getPostBySlug(slug)
    return http.json(res, 'Thành công', STATUS_CODE.OK, post)
  } catch (error) {
    next(error)
  }
}

const createPost = async (req, res, next) => {
  const data = req.body
  const { id, permissions } = req.user

  try {
    await PostService.createPost(data, id, permissions)
    return http.json(res, 'Thành công', STATUS_CODE.CREATED)
  } catch (error) {
    next(error)
  }
}
const updatePost = async (req, res, next) => {
  const { id } = req.params
  const data = req.body
  try {
    await PostService.updatePost(id, data)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deletePost = async (req, res, next) => {
  const { id } = req.params
  try {
    await PostService.deletePostById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateStatus = async (req, res, next) => {
  const { id } = req.params
  const { status } = req.body
  try {
    await PostService.updatePostStatus({ id, status })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createPost,
  updatePost,
  getPosts,
  getPublicPosts,
  getPostById,
  getPostBySlug,
  deletePost,
  updateStatus
}
