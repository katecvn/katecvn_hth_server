const asset = (filePath) => {
  const baseUrl = `${process.env.APP_URL}:${process.env.APP_PORT}` || 'http://localhost:8005'
  const cleanedPath = filePath.replace(/^\/+/, '')

  return new URL(cleanedPath, baseUrl).href
}

module.exports = asset
