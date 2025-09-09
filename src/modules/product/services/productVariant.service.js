const db = require('../../../models')

const getProductVariantById = async ({ id }) => {
  return await db.ProductVariant.findOne({
    where: { id },
    include: [
      {
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: db.VariantAttribute,
        as: 'attributes',
        include: [
          {
            model: db.ProductAttribute,
            as: 'attribute',
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  })
}

const getProductVariants = async () => {
  return await db.ProductVariant.findAll({
    include: [
      {
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: db.VariantAttribute,
        as: 'attributes',
        include: [
          {
            model: db.ProductAttribute,
            as: 'attribute',
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  })
}

module.exports = {
  getProductVariantById,
  getProductVariants
}
