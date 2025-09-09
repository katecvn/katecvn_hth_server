const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const modelsPath = path.join(__dirname, 'src/modules/product/models')

const migrations = [
  {
    name: 'Category',
    attributes:
      'parentId:integer,level:integer,name:string,thumbnail:string,createdBy:integer,updatedBy:integer,createdAt:date,updatedAt:date,deletedAt:date'
  },
  { name: 'Brand', attributes: 'name:string,description:string,createdBy:integer,updatedBy:integer,createdAt:date,updatedAt:date,deletedAt:date' },
  { name: 'BrandHasCategory', attributes: 'categoryId:integer,brandId:integer' },
  {
    name: 'ProductAttribute',
    attributes: `
      categoryId:integer, 
      brandId:integer,
      unit:string,
      linkUrl:string,
      createdBy:integer,
      updatedBy:integer,
      createdAt:date,
      updatedAt:date,
      deletedAt:date`
  },
  {
    name: 'Product',
    attributes: 'categoryId:integer,name:string,description:string,createdBy:integer,updatedBy:integer,createdAt:date,updatedAt:date,deletedAt:date'
  },
  { name: 'ProductAttributeValue', attributes: 'productId:integer,attributeId:integer,value:string' },
  {
    name: 'ProductVariant',
    attributes:
      'productId:integer,sku:string,stock:integer,price:decimal,createdBy:integer,updatedBy:integer,createdAt:date,updatedAt:date,deletedAt:date'
  },
  { name: 'InventoryMovement', attributes: 'variantId:integer,changeType:string,quantity:integer,reason:string,createdBy:integer,createdAt:date' },
  { name: 'ProductVariantPrice', attributes: 'variantId:integer,price:decimal,startDate:date,endDate:date' },
  { name: 'VariantAttribute', attributes: 'variantId:integer,attributeName:string,attributeValue:string' },
  {
    name: 'ProductReview',
    attributes:
      'productId:integer,customerId:integer,rating:integer,reviewText:string,createdBy:integer,updatedBy:integer,createdAt:date,updatedAt:date,deletedAt:date'
  }
]

const generateMigration = (name, attributes) => {
  const command = `npx sequelize-cli model:generate --name ${name} --attributes ${attributes}`

  console.log(`🚀 Running: ${command}`)

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error generating migration for ${name}:`, error)
      return
    }
    if (stderr) {
      console.error(`⚠️ Stderr for ${name}:`, stderr)
      return
    }

    console.log(`✅ Migration created for ${name}`)

    // Di chuyển model vào thư mục models mong muốn
    const oldPath = path.join(__dirname, 'src/models', `${name}.js`)
    const newPath = path.join(modelsPath, `${name}.js`)

    if (!fs.existsSync(modelsPath)) {
      fs.mkdirSync(modelsPath, { recursive: true })
    }

    setTimeout(() => {
      if (fs.existsSync(oldPath)) {
        fs.rename(oldPath, newPath, (moveError) => {
          if (moveError) {
            console.error(`❌ Error moving model for ${name}:`, moveError)
          } else {
            console.log(`✅ Model for ${name} moved successfully!`)
          }
        })
      } else {
        console.warn(`⚠️ Model file for ${name} not found, skipping move.`)
      }
    }, 3000)
  })
}

// Chạy tạo migrations cho tất cả các bảng
migrations.forEach(({ name, attributes }) => generateMigration(name, attributes))
