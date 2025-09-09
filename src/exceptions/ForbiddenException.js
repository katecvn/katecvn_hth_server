const { STATUS_CODE } = require('../constants')
const HttpException = require('./HttpException')

class ForbiddenException extends HttpException {
  constructor(message, status = STATUS_CODE.FORBIDDEN) {
    super(message)
    this.status = status
  }
}

module.exports = ForbiddenException
