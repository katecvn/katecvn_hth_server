const { STATUS_CODE } = require('../constants')
const HttpException = require('../exceptions/HttpException')

const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpException) {
    console.log('exception:>>', err.message)
    return res.status(err.status).json({ status: err.status, messages: err.message })
  }

  console.log('error:>>', err)
  return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: STATUS_CODE.INTERNAL_SERVER_ERROR, messages: err.message })
}

module.exports = errorHandler
