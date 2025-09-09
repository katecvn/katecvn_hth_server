const { validationResult } = require('express-validator')
const ValidationException = require('../exceptions/ValidationException')

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const messages = errors.array().reduce((accumulator, { path, msg }) => {
      accumulator[path] = [...(accumulator[path] || []), msg || '']
      return accumulator
    }, {})

    Object.keys(messages).forEach((path) => {
      messages[path] = messages[path].join('. ')
    })

    return next(new ValidationException(messages))
  }

  return next()
}

module.exports = { validate }
