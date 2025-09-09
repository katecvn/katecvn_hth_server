const ServiceException = require('../../../exceptions/ServiceException')
const storage = require('../../../utils/Storage')
const asset = require('../../../utils/Asset')
const fs = require('fs')
const path = require('path')
const { formatFileSize } = require('../../../utils/FileSize')

const uploadFiles = async (files, project, prefix) => {
  if (!files || (files && !files.length)) {
    throw new ServiceException({
      files: 'Không có tệp nào được tải lên.'
    })
  }
  try {
    const promise = files.map((file) => storage.optimize(prefix, file.buffer, storage.publicPath(`${project}`)))

    return await Promise.all(promise)
  } catch (error) {
    throw new Error(error.message)
  }
}

const getFiles = async (project, prefix = [], page = 1, limit = 1000, sort = 'asc') => {
  const folderPath = storage.publicPath(`${project}`)
  if (!fs.existsSync(folderPath)) {
    return []
  }

  try {
    const files = fs
      .readdirSync(folderPath)
      .filter((file) => prefix.length === 0 || prefix.some((p) => file.startsWith(p)))
      .map((file) => {
        const filePath = path.join(folderPath, file)
        const { size, birthtime, mtime } = fs.statSync(filePath)

        return {
          name: file,
          url: asset(`${project}/${file}`),
          size,
          createdAt: birthtime,
          lastModifiedAt: mtime
        }
      })

    files.sort((a, b) => (sort === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt))

    const startIndex = (page - 1) * limit
    return files.slice(startIndex, startIndex + limit)
  } catch (error) {
    throw new Error(error.message)
  }
}

const getFolderSize = async (project) => {
  try {
    const filePath = storage.publicPath(`${project}`)
    if (!fs.existsSync(filePath)) {
      return {
        sizeLabel: formatFileSize(0),
        size: 0
      }
    }
    // Hàm đệ quy để lấy tất cả file
    const getAllFiles = (dirPath) => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true })
      let fileList = []

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        if (entry.isDirectory()) {
          // Nếu là thư mục, đệ quy để lấy file bên trong
          fileList = fileList.concat(getAllFiles(fullPath))
        } else if (entry.isFile()) {
          // Nếu là file, thêm vào danh sách
          fileList.push(fullPath)
        }
      }
      return fileList
    }
    const files = getAllFiles(filePath)
    // Tính tổng kích thước của tất cả file
    const stats = files.map((file) => fs.statSync(file))
    const size = stats.reduce((accumulator, { size }) => accumulator + size, 0)
    return {
      sizeLabel: formatFileSize(size),
      size
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteFiles = async (files) => {
  const baseUrl = `${process.env.APP_URL}:${process.env.APP_PORT}`
  const paths = files.map((file) => storage.publicPath(file.replace(baseUrl, '')))
  const validPaths = paths.filter(fs.existsSync)
  if (!validPaths.length) {
    throw new ServiceException({
      files: 'Không có đường dẫn hợp lệ.'
    })
  }
  try {
    await Promise.all(validPaths.map((filePath) => storage.unlink(filePath)))
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  getFiles,
  getFolderSize,
  uploadFiles,
  deleteFiles
}
