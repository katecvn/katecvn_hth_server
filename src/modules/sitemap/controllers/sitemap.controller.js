const SitemapService = require('../services/sitemap.service')
const { SitemapStream, streamToPromise } = require('sitemap')
const url = process.env.CLIENT_URL

const getSitemap = async (req, res, next) => {
  try {
    const result = await SitemapService.getDynamicRoutes()

    const smStream = new SitemapStream({ hostname: url })
    result.forEach((route) => smStream.write(route))
    smStream.end()

    const sitemap = await streamToPromise(smStream).then((sm) => sm.toString())

    res.header('Content-Type', 'application/xml')
    res.send(sitemap)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSitemap
}
