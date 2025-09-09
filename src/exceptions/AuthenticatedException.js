const { STATUS_CODE } = require('../constants')
const HttpException = require('./HttpException')

class AuthenticatedException extends HttpException {
  constructor(message, status = STATUS_CODE.UNAUTHORIZED) {
    super(message)
    this.status = status
  }
}

module.exports = AuthenticatedException
