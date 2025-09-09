const axios = require('axios')
require('dotenv').config()

const baseURL = process.env.BCCU_APP_URL

const createBCCUApi = (token, signature) => {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-signature': signature
    },
    httpsAgent: new (require('https').Agent)({
      rejectUnauthorized: false
    })
  })
}

module.exports = createBCCUApi
