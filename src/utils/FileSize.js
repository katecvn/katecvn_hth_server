const formatFileSize = (bytes, decimals = 2) => {
  if (Number(bytes) === 0) {
    return '0 Bytes'
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${(bytes / Math.pow(1024, index)).toFixed(decimals)} ${sizes[index]}`
}

module.exports = { formatFileSize }
