const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const NotFoundException = require('../exceptions/NotFoundException')

const basePublicPath = path.join(__dirname, '../public/')
const baseStorage = path.join(__dirname, '../storage/')

const publicPath = (relativePath = '') => {
  return path.normalize(path.join(basePublicPath, relativePath))
}

const storagePath = (relativePath = '') => {
  return path.normalize(path.join(baseStorage, relativePath))
}

const configOptimizeOptions = () => {
  return {
    jpeg: { quality: 80 },
    webp: { quality: 80 },
    png: { compressionLevel: 8 }
  }
}

const optimize = async (prefix, file, output, options = {}) => {
  const fileName = prefix + '_' + uuidv4()
  const { format, width, height } = await sharp(file).metadata()
  const fileNameOutput = `${fileName}.${format}`
  const fileOutput = path.join(output, fileNameOutput)
  ensureDirectoryExistence(fileOutput)

  const optimizeOptions = configOptimizeOptions()
  const formatOptions = optimizeOptions[format] || {}
  return sharp(file)
    .resize(options.width || width, options.height || height)
    .toFormat(format, { ...formatOptions, quality: options.quality || formatOptions.quality })
    .toFile(fileOutput)
}

const ensureDirectoryExistence = (filePath) => {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const storeAs = (file, output, fileName) => {
  ensureDirectoryExistence(path.join(output, fileName))
  const filePath = path.join(output, fileName)
  const buffer = fs.read(file)
  return fs.writeFileSync(filePath, buffer)
}

const unlink = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new NotFoundException(`Không tìm thấy đường dẫn: ${filePath}`)
  }

  return fs.unlinkSync(filePath)
}

module.exports = {
  publicPath,
  storagePath,
  configOptimizeOptions,
  optimize,
  ensureDirectoryExistence,
  storeAs,
  unlink
}
