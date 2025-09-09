const { query, body } = require('express-validator')
const PROJECT = require('../../../constants/project')
const { message } = require('../../../constants/message')

const fileUploadRequest = [
  query('project')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(PROJECT))
    .withMessage(message.isIn(Object.values(PROJECT))),
  query('prefix')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isLength({ min: 3, max: 191 })
    .withMessage(message.isLength(3, 191))
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Tên tiền tố chỉ có thể chứa chữ cái, số, dấu gạch ngang (-) và dấu gạch dưới (_)')
]

const getFilesRequest = [
  query('project')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(PROJECT))
    .withMessage(message.isIn(Object.values(PROJECT))),
  query('prefix').isArray({ min: 1 }).withMessage(message.isArray),
  query('prefix.*')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isLength({ min: 3, max: 191 })
    .withMessage(message.isLength(3, 191))
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Tên tiền tố chỉ có thể chứa chữ cái, số, dấu gạch ngang (-) và dấu gạch dưới (_)'),
  query('page').optional().isInt({ min: 1 }).withMessage(message.isInt(1)).toInt(),
  query('limit').optional().isInt({ min: 1 }).withMessage(message.isInt(1)).toInt(),
  query('sort').optional().isIn(['asc', 'desc']).withMessage('Chỉ cho phép các giá trị: asc, desc')
]

const getFolderSizeRequest = [
  query('project')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(PROJECT))
    .withMessage(message.isIn(Object.values(PROJECT)))
]

const deleteFilesRequest = [
  body('files').isArray({ min: 1, max: 100 }).withMessage('Các tập tin phải là mảng có tối thiểu 1 và tối đa 100 tập tin'),
  body('files.*')
    .isURL({ protocols: ['http', 'https'], require_protocol: true, require_tld: false })
    .withMessage('Phải là Url hợp lệ')
]

module.exports = {
  getFilesRequest,
  fileUploadRequest,
  getFolderSizeRequest,
  deleteFilesRequest
}
