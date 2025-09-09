const validateVietnamesePhone = (number) => {
  // (Update to 2024)
  const mobileRegex = /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/
  const landlineRegex = /^(0|\+84)(20[1-9]|21[0-3]|22[0-2]|23[0-9]|24[0-6]|25[1-9]|26[0-3]|27[0-9]|28[0-3]|29[0-7]|2[0-9]{2})[0-9]{7}$/

  return mobileRegex.test(number) || landlineRegex.test(number)
}

module.exports = {
  validateVietnamesePhone
}
