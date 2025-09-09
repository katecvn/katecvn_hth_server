const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const fileService = require('../services/upload.service')

const uploadFiles = async (req, res, next) => {
  const { project, prefix } = req.query
  const files = req.files
  try {
    await fileService.uploadFiles(files, project, prefix)
    return http.json(res, 'Upload success', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const getFiles = async (req, res, next) => {
  const { project, prefix, page, limit, sort } = req.query
  try {
    const files = await fileService.getFiles(project, prefix, page, limit, sort)
    return http.json(res, 'Files', STATUS_CODE.OK, files)
  } catch (error) {
    next(error)
  }
}

const getFolderSize = async (req, res, next) => {
  const { project } = req.query
  try {
    const size = await fileService.getFolderSize(project)
    return http.json(res, 'Folder size', STATUS_CODE.OK, size)
  } catch (error) {
    next(error)
  }
}

const deleteFiles = async (req, res, next) => {
  const { files } = req.body
  try {
    await fileService.deleteFiles(files)
    return http.json(res, 'Delete success', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  uploadFiles,
  getFiles,
  getFolderSize,
  deleteFiles
}
