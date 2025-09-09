const TopicService = require('../services/TopicService')
const http = require('../utils/http')
const { STATUS_CODE } = require('../constants')
const BASE_STATUS = require('../constants/status')

const getTopics = async (req, res, next) => {
  const { page, limit, ids, keyword, topicIds } = req.query

  try {
    const topics = await TopicService.getTopics({ page, limit, ids, keyword, topicIds })
    return http.json(res, 'Thành công', STATUS_CODE.OK, topics)
  } catch (error) {
    next(error)
  }
}

const getPublicTopics = async (req, res, next) => {
  const { page, limit, ids, keyword, topicIds } = req.query

  try {
    const topics = await TopicService.getTopics({ page, limit, ids, keyword, topicIds }, BASE_STATUS.ACTIVE)
    return http.json(res, 'Thành công', STATUS_CODE.OK, topics)
  } catch (error) {
    next(error)
  }
}

const getTopicById = async (req, res, next) => {
  const { id } = req.params

  try {
    const topic = await TopicService.getTopicById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, topic)
  } catch (error) {
    next(error)
  }
}

const createTopic = async (req, res, next) => {
  const data = req.body

  try {
    await TopicService.createTopic(data)
    return http.json(res, 'Thành công', STATUS_CODE.CREATED)
  } catch (error) {
    next(error)
  }
}

const updateTopic = async (req, res, next) => {
  const data = req.body
  const { id } = req.params
  try {
    await TopicService.updateTopic(id, data)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteTopic = async (req, res, next) => {
  const { id } = req.params

  try {
    await TopicService.deleteTopic(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateStatus = async (req, res, next) => {
  const { id } = req.params
  const { status } = req.body
  try {
    await TopicService.updateTopicStatus({ id, status })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTopics,
  getPublicTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  updateStatus
}
