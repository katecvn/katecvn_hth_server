const forge = require('node-forge')
require('dotenv').config()

const generateCloudSignature = (secretKey) => {
    const md = forge.md.sha256.create()
    md.update(secretKey)

    return md.digest().toHex()
}

module.exports = { generateCloudSignature }
