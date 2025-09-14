const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = require('../config/connectDB')
const fs = require('fs')
const path = require('path')

// Đọc tất cả models trong thư mục `src/models/`
const db = { sequelize, Sequelize }

fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes)
    db[model.name] = model
  })

// Import models từ tất cả các module con
const modulePaths = [
  '../modules/order/models',
  '../modules/product/models',
  '../modules/discount/models',
  '../modules/contact/models',
  '../modules/wish_list/models',
  '../modules/product_variant/models',
  '../modules/recruit/models',
  '../modules/customer_group/models',
  '../modules/customer_group_discount/models',
  '../modules/customer_group_discount_histories/models',
] // Có thể thêm module khác tại đây

modulePaths.forEach((modulePath) => {
  const absolutePath = path.join(__dirname, modulePath)
  const moduleModels = require(absolutePath)
  Object.assign(db, moduleModels)
})

// Thiết lập quan hệ giữa các models
Object.values(db).forEach((model) => {
  if (model.associate) {
    if(model.name == "Product"){
      console.log('Associating model:', model.associate.toString())
    }
    model.associate(db)
  }
})

module.exports = db
