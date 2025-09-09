const { message } = require('../constants/message')

const sendErrorResponse = (res, { status = 500, messages }) => {
  return res.status(status).json({ messages: messages })
}

const sendResponse = (res, { status = 500, messages = null, data = null, itemCount = null, pageCount = null, currentPage = null }) => {
  return res.status(status).json({
    ...(status != null ? { status } : {}),
    ...(messages != null ? { messages } : {}),
    ...(data != null ? { data } : {}),
    ...(itemCount != null ? { itemCount } : {}),
    ...(pageCount != null ? { pageCount } : {}),
    ...(currentPage != null ? { currentPage } : {})
  })
}

const sendResponseError = (res, { status = 500, messages = message.internalServerError, errorMessage = null }) => {
  return res
    .status(status)
    .json({ ...(status != null ? { status } : {}), ...(messages != null ? { messages } : {}), ...(errorMessage != null ? { errorMessage } : {}) })
}

const json = (res, status, message, data = null) => {
  return res.status(status).json({ status, message, data })
}

module.exports = { sendResponse, sendErrorResponse, json, sendResponseError }
