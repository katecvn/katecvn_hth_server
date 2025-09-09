const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const storage = require('../utils/Storage')
const {
  imageMimetype,
  documentMimetype,
  videoMimetype,
  audioMimetype,
  compressedMimetype,
  codeMimetype,
  fontMimetype
} = require('../constants/mime-type')

const storageOption = process.env.STORAGE_LOCATION
const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 2000000
const defaultMimeType = [
  ...imageMimetype,
  ...documentMimetype,
  ...videoMimetype,
  ...audioMimetype,
  ...compressedMimetype,
  ...codeMimetype,
  ...fontMimetype
]

const diskStorageConfig = () => {
  return {
    destination: (req, file, cb) => {
      const folderPath = storage.storagePath('tmp')
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
      }
      cb(null, folderPath)
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname)
      const uniqueFilename = `${uuidv4()}${fileExt}`
      cb(null, uniqueFilename)
    }
  }
}

const fileFilter = (allowedMimetype) => {
  return (req, file, callback) => {
    if (!allowedMimetype.includes(file.mimetype)) {
      return callback(new multer.MulterError('INVALID_EXTENSION'), false)
    }

    callback(null, true)
  }
}

const multerConfig = (allowedMimetype, fileSize) => {
  const storageOptions = {
    memory: multer.memoryStorage(),
    disk: multer.diskStorage(diskStorageConfig())
  }

  return {
    storage: storageOptions[storageOption],
    fileFilter: fileFilter(allowedMimetype),
    limits: { fileSize }
  }
}

const single = (fieldName, { size = maxFileSize, mimetype = defaultMimeType } = {}) => {
  return multer(multerConfig(mimetype, size)).single(fieldName)
}

const array = (fieldName, maxCount, { size = maxFileSize, mimetype = defaultMimeType } = {}) => {
  return multer(multerConfig(mimetype, size)).array(fieldName, maxCount)
}

module.exports = {
  single,
  array
}
