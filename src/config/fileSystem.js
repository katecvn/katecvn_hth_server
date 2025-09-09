const storage = require('../utils/Storage')
const express = require('express')

const fileSystem = (app) => {
  app.use('/', express.static(storage.publicPath()))
}

module.exports = fileSystem
