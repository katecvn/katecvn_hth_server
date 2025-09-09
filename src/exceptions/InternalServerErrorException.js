const { STATUS_CODE } = require('../constants')

class InternalServerErrorException extends Error {
  constructor(message, status = STATUS_CODE.INTERNAL_SERVER_ERROR) {
    super(message, status)
  }
}

module.exports = InternalServerErrorException
