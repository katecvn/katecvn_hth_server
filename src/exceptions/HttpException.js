class HttpException extends Error {
  constructor(message, status) {
    super(message, status)
    this.status = status
  }
}

module.exports = HttpException
