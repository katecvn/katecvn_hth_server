const { STATUS_CODE } = require('../constants')
const HttpException = require('./HttpException')

class NotFoundException extends HttpException {
  constructor(message, status = STATUS_CODE.NOT_FOUND) {
    super(message)
    this.status = status
  }
}

module.exports = NotFoundException
