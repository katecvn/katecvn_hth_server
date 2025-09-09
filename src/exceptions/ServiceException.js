const { STATUS_CODE } = require('../constants')
const HttpException = require('./HttpException')

/**
 * Custom exception class for service-related errors.
 * Extends the HttpException class.
 *
 * @class ServiceException
 * @extends {HttpException}
 */
class ServiceException extends HttpException {
  /**
   * Creates an instance of ServiceException.
   *
   * @param {string} message - The error message describing the exception.
   * @param {number} [status=STATUS_CODE.BAD_REQUEST] - The HTTP status code (default: BAD_REQUEST).
   */
  constructor(message, status = STATUS_CODE.BAD_REQUEST) {
    super(message, status)
    this.message = message
  }
}

module.exports = ServiceException
