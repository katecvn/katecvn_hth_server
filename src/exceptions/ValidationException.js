const { STATUS_CODE } = require('../constants')
const HttpException = require('./HttpException')

class ValidationException extends HttpException {
  constructor(message = 'Validation exception', status = STATUS_CODE.UNPROCESSABLE_ENTITY) {
    super(message, status)
    this.message = message
  }
}

module.exports = ValidationException
