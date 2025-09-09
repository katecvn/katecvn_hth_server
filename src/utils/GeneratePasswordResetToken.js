const generateResetPasswordToken = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000)
    return randomNumber.toString().padStart(6, '0')
}

module.exports = generateResetPasswordToken