const rateLimit = require('express-rate-limit')

const { message: messageError } = require('../constants/message')

const CreateLimiter = ({ max = 100, minutes = 15 } = {}) =>
  rateLimit({ max, windowMs: minutes * 60 * 1000, message: messageError.tooManyRequestsPleaseTryAgainLater(minutes) })

module.exports = { CreateLimiter }
