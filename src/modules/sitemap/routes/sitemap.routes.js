const express = require('express')
const { getSitemap } = require('../controllers/sitemap.controller')
const router = express.Router()

router.get('/sitemap.xml', getSitemap)

module.exports = router
