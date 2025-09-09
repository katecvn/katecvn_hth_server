const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

const generatePassword = () => {
  const randomString = uuidv4()
  return bcrypt.hashSync(randomString, 10)
}

module.exports = generatePassword
