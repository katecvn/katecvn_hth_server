const express = require('express')
const router = express.Router()
const { validate } = require('../../../middlewares/Validate')
const upload = require('../../../config/multer')
const { imageMimetype } = require('../../../constants/mime-type')
const fileController = require('../controllers/upload.controller')
const fileValidate = require('../validations/upload.validation')

router.get('/files/shows', fileValidate.getFilesRequest, validate, fileController.getFiles)
router.get('/files/folder-size', fileValidate.getFolderSizeRequest, validate, fileController.getFolderSize)
router.post(
  '/files/upload',
  fileValidate.fileUploadRequest,
  validate,
  upload.array('files', 50, { mimetype: imageMimetype }),
  fileController.uploadFiles
)
router.delete('/files/delete-files', fileValidate.deleteFilesRequest, validate, fileController.deleteFiles)

module.exports = router
