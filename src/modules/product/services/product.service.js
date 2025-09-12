const { Op } = require('sequelize')
const { STATUS_CODE, PRODUCT_STATUS } = require('../../../constants')
const { message } = require('../../../constants/message')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')
const { generateCloudSignature } = require('../../../utils/SignBCCU')
const jwt = require('jsonwebtoken')
const createBCCUApi = require('../../../utils/AxiosBCCU')
const { get } = require('../routes/product.routes')

const createProduct = async (data) => {
  const {
    brandId,
    categoryId,
    productGroupId,
    name,
    slug,
    unit,
    salePrice,
    originalPrice,
    stock,
    sku,
    seoTitle,
    seoDescription,
    seoKeywords,
    content,
    imagesUrl = [],
    status = 'active',
    isFeatured = false,
    creator,
    variants = [],
    specificationValues = [],
    optionMappings = []
  } = data

  if (brandId) {
    const isExistBrand = await db.Brand.findByPk(brandId)
    if (!isExistBrand) throw new ServiceException({ brandId: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  if (categoryId) {
    const isExistCategory = await db.Category.findByPk(categoryId)
    if (!isExistCategory) throw new ServiceException({ categoryId: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  if (productGroupId) {
    const isExistGroup = await db.ProductGroup.findByPk(productGroupId)
    if (!isExistGroup) throw new ServiceException({ productGroupId: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const isExistedSlug = await db.Product.findOne({
    where: { slug }
  })

  if (isExistedSlug) {
    throw new ServiceException({ slug: message.isExisted }, STATUS_CODE.UNPROCESSABLE_ENTITY)
  }

  const isExistedSku = await db.Product.findOne({
    where: { sku }
  })

  if (isExistedSku) {
    throw new ServiceException({ sku: message.isExisted }, STATUS_CODE.UNPROCESSABLE_ENTITY)
  }

  const transaction = await db.sequelize.transaction()
  try {
    const product = await db.Product.create(
      {
        brandId,
        categoryId,
        productGroupId,
        name,
        slug,
        unit,
        salePrice,
        originalPrice,
        stock,
        sku,
        seoTitle,
        seoDescription,
        seoKeywords,
        content,
        imagesUrl: JSON.stringify(imagesUrl),
        status,
        isFeatured,
        createdBy: creator
      },
      { transaction }
    )

    if (specificationValues.length) {
      for (const specificationValue of specificationValues) {
        await db.ProductSpecification.create(
          {
            productId: product.id,
            specificationId: specificationValue.specificationId,
            unit: specificationValue.unit || '',
            value: specificationValue.value || ''
          },
          { transaction }
        )
      }
    }

    if (optionMappings.length) {
      for (const optMapping of optionMappings) {
        await db.ProductOptionMapping.create(
          {
            productId: product.id,
            optionId: optMapping.optionId,
            value: optMapping.value
          },
          { transaction }
        )
      }
    }

    if (variants.length) {
      for (const variant of variants) {
        const { sku, stock, salePrice, originalPrice, position = 0, imageUrl, status, attributeValues = [] } = variant

        const isExistedSku = await db.ProductVariant.findOne({
          where: { sku }
        })

        if (isExistedSku) {
          throw new ServiceException({ sku: `Mã biến thể ${sku} đã tồn tại` }, STATUS_CODE.UNPROCESSABLE_ENTITY)
        }

        const productVariant = await db.ProductVariant.create(
          {
            productId: product.id,
            sku,
            stock,
            unit,
            salePrice,
            originalPrice,
            position,
            imageUrl,
            status,
            createdBy: creator
          },
          { transaction }
        )

        if (attributeValues.length) {
          for (const attributeValue of attributeValues) {
            const isExistAttributeValue = await db.AttributeValue.findOne({
              where: { id: attributeValue.id }
            })

            if (!isExistAttributeValue) {
              throw new ServiceException({ attributeValues: `Thuộc tính ${attributeValue.id} không tồn tại` }, STATUS_CODE.NOT_FOUND)
            }

            await db.VariantAttributeAssignment.create(
              {
                variantId: productVariant.id,
                attributeValueId: attributeValue.id,
                customValue: attributeValue.customValue
              },
              { transaction }
            )
          }
        }
      }
    } else {
      await db.ProductVariant.create(
        {
          productId: product.id,
          imageUrl: imagesUrl[0] || '',
          sku,
          stock,
          originalPrice,
          salePrice,
          unit,
          position: 0,
          status: 'active'
        },
        { transaction }
      )
    }

    await transaction.commit()
    return product
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, error.status)
  }
}

const productMapping = async (products) => {
  products.forEach((product) => {
    product.imagesUrl = (product.imagesUrl && JSON.parse(product.imagesUrl)) || []
  })

  const plainProducts = products.map((p) => p.get({ plain: true }))

  await Promise.all(
    plainProducts.map(async (product) => {
      const { count } = await db.ProductVariant.findAndCountAll({
        where: { productId: product.id },
        distinct: true
      })

      product.totalVariants = count
    })
  )

  return products
}

const getProducts = async ({
  page = 1,
  limit = 9999,
  ids,
  keyword,
  categoryId,
  brandIds,
  categorySlugs,
  sort = 'DESC',
  feature = 0,
  isPublic = false,
  priceMin = 0,
  priceMax
}) => {
  const offset = (page - 1) * limit
  const conditions = {}

  if (ids) {
    const idsMap = ids.split(',').map(Number)
    conditions.id = { [Op.in]: idsMap }
  }

  if (keyword && keyword !== '') {
    conditions[Op.or] = [{ name: { [Op.like]: `%${keyword}%` } }, { seoDescription: { [Op.like]: `%${keyword}%` } }]
  }

  if (categoryId) {
    const category = await db.Category.findByPk(categoryId)

    if (category?.parentId === null) {
      const subCategories = await db.Category.findAll({
        where: { parentId: categoryId },
        attributes: ['id']
      })

      const subCategoryIds = subCategories.map((cat) => cat.id)
      conditions.categoryId = {
        [Op.in]: [categoryId, ...subCategoryIds]
      }
    } else {
      conditions.categoryId = categoryId
    }
  }

  if (categorySlugs) {
    const categorySlugsArray = categorySlugs.split(',')
    const categories = await db.Category.findAll({
      where: { slug: { [Op.in]: categorySlugsArray } },
      attributes: ['id']
    })

    const categoryIdsMap = categories?.map((cat) => cat.id)

    conditions.categoryId = { [Op.in]: categoryIdsMap }
  }

  if (brandIds) {
    const brandIdsMap = brandIds.split(',').map(Number)
    conditions.brandId = { [Op.in]: brandIdsMap }
  }

  if (feature) {
    conditions.isFeatured = feature
  }

  if (isPublic) {
    conditions.status = { [Op.in]: [PRODUCT_STATUS.ACTIVE_LIST, PRODUCT_STATUS.ACTIVE] }
  }

  const order = []
  if (sort === 'DESC') {
    order.push(['id', 'DESC'])
  } else if (sort === 'ASC') {
    order.push(['id', 'ASC'])
  } else if (sort === 'PRICE_DESC') {
    order.push(['salePrice', 'DESC'])
  } else if (sort === 'PRICE_ASC') {
    order.push(['salePrice', 'ASC'])
  }

  if (priceMin && priceMax) {
    conditions.salePrice = {
      [Op.between]: [priceMin, priceMax]
    }
  }

  const { rows: products, count } = await db.Product.findAndCountAll({
    where: conditions,
    include: productDetailInclude,
    limit,
    offset,
    order,
    attributes: { exclude: ['deletedAt', 'content'] },
    distinct: true
  })

  const productsMapping = await productMapping(products)

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    products: productsMapping
  }
}

const getVariants = async ({ page = 1, limit = 9999, productIds, sku }) => {
  const offset = (page - 1) * limit
  const conditions = {}

  if (productIds) {
    const productIdsMap = productIds.split(',').map(Number)
    conditions.productId = { [Op.in]: productIdsMap }
  }

  if (sku && sku !== '') {
    conditions.sku = { [Op.like]: `%${sku}%` }
  }

  const { count, rows } = await db.ProductVariant.findAndCountAll({
    where: conditions,
    include: [
      {
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'slug', 'sku'],
        required: true
      },
      {
        model: db.AttributeValue,
        as: 'attributeValues',
        include: {
          model: db.Attribute,
          as: 'attribute',
          attributes: ['name', 'code']
        }
      }
    ],
    limit,
    offset,
    distinct: true,
    attributes: { exclude: ['deletedAt'] }
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    variants: rows
  }
}

const productDetailInclude = [
  {
    model: db.Category,
    as: 'category',
    attributes: ['id', 'name', 'slug']
  },
  {
    model: db.Brand,
    as: 'brand',
    attributes: ['id', 'name']
  },
  { model: db.ProductGroup, as: 'productGroup', attributes: ['id', 'name'] },
  {
    model: db.ProductSpecification,
    as: 'specificationValues',
    include: [
      {
        model: db.Specification,
        as: 'specification',
        attributes: ['id', 'name'],
        include: {
          model: db.SpecificationGroup,
          as: 'group',
          attributes: ['id', 'name', 'position']
        }
      }
    ]
  },
  {
    model: db.ProductOptionMapping,
    as: 'optionMappings',
    attributes: ['id', 'optionId', 'value', 'productId']
  },
  {
    model: db.ProductVariant,
    as: 'variants',
    attributes: { exclude: ['deletedAt'] },
    include: [
      {
        model: db.AttributeValue,
        as: 'attributeValues',
        include: {
          model: db.Attribute,
          as: 'attribute',
          attributes: ['name', 'code']
        }
      }
    ],
    order: [['position', 'ASC']],
    separate: true
  }
]

const getProductById = async (id) => {
  const product = await db.Product.findOne({
    where: { id },
    include: productDetailInclude,
    attributes: { exclude: ['deletedAt'] }
  })

  if (!product) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  return await productDetailMapping(product)
}

const getProductBySlug = async (slug) => {
  const product = await db.Product.findOne({
    where: { slug },
    include: [
      {
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: db.Brand,
        as: 'brand',
        attributes: ['id', 'name']
      },
      {
        model: db.ProductSpecification,
        as: 'specificationValues',
        include: [
          {
            model: db.Specification,
            as: 'specification',
            attributes: ['id', 'name'],
            include: {
              model: db.SpecificationGroup,
              as: 'group',
              attributes: ['id', 'name', 'position']
            }
          }
        ]
      },
      {
        model: db.ProductVariant,
        as: 'variants',
        where: { status: { [Op.ne]: 'hide' } },
        attributes: { exclude: ['deletedAt'] },
        include: [
          {
            model: db.AttributeValue,
            as: 'attributeValues',
            include: {
              model: db.Attribute,
              as: 'attribute',
              attributes: ['name', 'code']
            }
          }
        ],
        required: true,
        order: [['position', 'ASC']],
        separate: true
      }
    ],
    attributes: { exclude: ['deletedAt'] }
  })

  if (!product) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const relatedProducts = await db.Product.findAll({
    where: {
      categoryId: product.categoryId,
      id: { [Op.ne]: product.id }
    },
    include: [
      {
        model: db.ProductVariant,
        as: 'variants',
        where: { status: { [Op.ne]: 'hide' } },
        attributes: { exclude: ['deletedAt'] },
        include: [
          {
            model: db.AttributeValue,
            as: 'attributeValues',
            include: {
              model: db.Attribute,
              as: 'attribute',
              attributes: ['name', 'code']
            }
          }
        ],
        required: true,
        order: [['position', 'ASC']],
        separate: true
      }
    ]
  })

  const productInGroup = product?.productGroupId
    ? await db.Product.findAll({
        where: {
          productGroupId: product.productGroupId
        },
        include: [
          {
            model: db.ProductOptionMapping,
            as: 'optionMappings',
            attributes: ['id', 'optionId', 'value', 'productId']
          }
        ],
        attributes: ['id', 'name', 'slug']
      })
    : []

  const relatedProductsMapping = await productMapping(relatedProducts)

  product.dataValues.relatedProducts = relatedProductsMapping
  product.dataValues.productInGroup = productInGroup

  return await productDetailMapping(product)
}

const productDetailMapping = async (product) => {
  product.imagesUrl = product.imagesUrl ? JSON.parse(product.imagesUrl) : []

  const variantIdsMap = product?.variants?.map((variant) => variant.id)

  const variantAttributeAssignments = await db.VariantAttributeAssignment.findAll({
    where: {
      variantId: { [Op.in]: variantIdsMap }
    }
  })

  const attributeIdMap = [...new Set(variantAttributeAssignments.map((assignment) => assignment.attributeValueId))]

  const values = await db.AttributeValue.findAll({
    where: {
      id: { [Op.in]: attributeIdMap }
    },
    include: [
      {
        model: db.Attribute,
        as: 'attribute',
        attributes: ['id', 'name', 'code']
      }
    ]
  })

  product.dataValues.attributeValues = values

  const groupedMap = values.reduce((acc, item) => {
    const key = item.attribute.code
    if (!acc[key]) {
      acc[key] = {
        name: item.attribute.name,
        code: item.attribute.code,
        value: []
      }
    }
    acc[key].value.push(item.value)
    return acc
  }, {})

  const specGroupedMap = product?.specificationValues?.reduce((acc, item) => {
    const groupId = item.specification.group.id
    if (!acc[groupId]) {
      acc[groupId] = {
        group: item.specification.group,
        specs: []
      }
    }
    acc[groupId].specs.push({
      id: item.specification.id,
      name: item.specification.name,
      value: item.value,
      unit: item.unit
    })
    return acc
  }, {})

  const specificationGroups = Object.values(specGroupedMap)
  const selectedOptions = Object.values(groupedMap)

  product.dataValues.selectedOptions = selectedOptions
  product.dataValues.specificationGroups = specificationGroups

  return product
}

const updateProductStatus = async (id, data) => {
  const { status } = data

  const product = await db.Product.findByPk(id)

  if (!product) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  try {
    await product.update({
      status
    })
    return true
  } catch (error) {
    throw new ServiceException(error.message, error.status)
  }
}

const updateProduct = async (id, data) => {
  const product = await db.Product.findOne({
    where: { id },
    include: [
      {
        model: db.ProductVariant,
        as: 'variants',
        attributes: { exclude: ['deletedAt'] },
        include: [
          {
            model: db.AttributeValue,
            as: 'attributeValues',
            include: {
              model: db.Attribute,
              as: 'attribute',
              attributes: ['name', 'code']
            }
          }
        ]
      }
    ]
  })

  if (!product) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const {
    brandId = null,
    categoryId,
    productGroupId = null,
    sku,
    name,
    slug,
    unit = null,
    originalPrice,
    salePrice,
    stock,
    content,
    seoTitle = null,
    seoDescription = null,
    seoKeywords = null,
    imagesUrl,
    isFeatured = 0,
    specificationValues,
    variants = [],
    optionMappings = [],
    updater
  } = data

  const variantIdsToUpdate = variants.filter((item) => !!item.variantId).map((item) => item.variantId)
  const currentVariantIds = product?.variants.map((item) => item.id) || []
  const variantIdsToDelete = currentVariantIds.filter((id) => !variantIdsToUpdate.includes(id))

  if (brandId) {
    const isExistBrand = await db.Brand.findByPk(brandId)
    if (!isExistBrand) throw new ServiceException({ brandId: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  if (categoryId) {
    const isExistCategory = await db.Category.findByPk(categoryId)
    if (!isExistCategory) throw new ServiceException({ categoryId: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  if (productGroupId) {
    const isExistGroup = await db.ProductGroup.findByPk(productGroupId)
    if (!isExistGroup) throw new ServiceException({ productGroupId: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const isExistedSlug = await db.Product.findOne({
    where: { slug, id: { [Op.ne]: id } }
  })

  if (isExistedSlug) {
    throw new ServiceException({ slug: message.isExisted }, STATUS_CODE.UNPROCESSABLE_ENTITY)
  }

  const isExistedSku = await db.Product.findOne({
    where: { sku, id: { [Op.ne]: id } }
  })

  if (isExistedSku) {
    throw new ServiceException({ sku: message.isExisted }, STATUS_CODE.UNPROCESSABLE_ENTITY)
  }

  const transaction = await db.sequelize.transaction()
  try {
    await product.update(
      {
        brandId,
        categoryId,
        productGroupId,
        sku,
        name,
        slug,
        unit,
        originalPrice,
        salePrice,
        stock,
        content,
        seoTitle,
        seoDescription,
        seoKeywords,
        imagesUrl: JSON.stringify(imagesUrl),
        isFeatured,
        updatedBy: updater
      },
      { transaction }
    )

    await db.ProductSpecification.destroy({
      where: {
        productId: id
      },
      transaction
    })

    if (specificationValues.length) {
      for (const specificationValue of specificationValues) {
        await db.ProductSpecification.create(
          {
            productId: id,
            specificationId: specificationValue.specificationId,
            unit: specificationValue.unit || '',
            value: specificationValue.value || ''
          },
          { transaction }
        )
      }
    }

    await db.ProductOptionMapping.destroy({ where: { productId: id }, transaction })

    if (optionMappings.length) {
      for (const optMapping of optionMappings) {
        await db.ProductOptionMapping.create(
          {
            productId: id,
            optionId: optMapping.optionId,
            value: optMapping.value
          },
          { transaction }
        )
      }
    }

    if (variantIdsToDelete.length) {
      await db.ProductVariant.destroy({
        where: { id: { [Op.in]: variantIdsToDelete } },
        transaction
      })
    }

    if (variants.length) {
      for (const variant of variants) {
        const { variantId, sku, stock, salePrice, originalPrice, position = 0, imageUrl, status, attributeValues = [] } = variant

        const where = { sku }

        if (variantId) {
          where.id = { [Op.ne]: variantId }
        }

        const isExistedSku = await db.ProductVariant.findOne({
          where
        })

        if (isExistedSku) {
          throw new ServiceException({ sku: `Mã biến thể ${sku} đã tồn tại` }, STATUS_CODE.BAD_REQUEST)
        }

        if (variantId) {
          const productVariant = await db.ProductVariant.findByPk(variantId)
          if (!productVariant) {
            throw new ServiceException({ variantId: message.notExist }, STATUS_CODE.NOT_FOUND)
          }

          productVariant.update(
            {
              sku,
              stock,
              salePrice,
              originalPrice,
              position,
              imageUrl,
              status,
              updatedBy: updater
            },
            { transaction }
          )

          await db.VariantAttributeAssignment.destroy({
            where: { variantId },
            transaction
          })

          if (attributeValues.length) {
            for (const attributeValue of attributeValues) {
              const isExistAttributeValue = await db.AttributeValue.findOne({
                where: { id: attributeValue.id }
              })

              if (!isExistAttributeValue) {
                throw new ServiceException({ attributeValues: `Thuộc tính ${attributeValue.id} không tồn tại` }, STATUS_CODE.NOT_FOUND)
              }

              await db.VariantAttributeAssignment.create(
                {
                  variantId,
                  attributeValueId: attributeValue.id,
                  customValue: attributeValue.customValue
                },
                { transaction }
              )
            }
          }
        } else {
          const newProductVariant = await db.ProductVariant.create(
            {
              productId: id,
              sku,
              stock,
              unit,
              salePrice,
              originalPrice,
              position,
              imageUrl,
              status,
              createdBy: updater
            },
            { transaction }
          )

          if (attributeValues.length) {
            for (const attributeValue of attributeValues) {
              const isExistAttributeValue = await db.AttributeValue.findOne({
                where: { id: attributeValue.id }
              })

              if (!isExistAttributeValue) {
                throw new ServiceException({ attributeValues: `Thuộc tính ${attributeValue.id} không tồn tại` }, STATUS_CODE.NOT_FOUND)
              }

              await db.VariantAttributeAssignment.create(
                {
                  variantId: newProductVariant.id,
                  attributeValueId: attributeValue.id,
                  customValue: attributeValue.customValue
                },
                { transaction }
              )
            }
          }
        }
      }
    }
    await transaction.commit()
    return product
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, error.status)
  }
}

const deleteProduct = async (id) => {
  const product = await db.Product.findByPk(id)

  if (!product) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const transaction = await db.sequelize.transaction()
  try {
    await product.destroy({ transaction })
    await db.ProductVariant.destroy({
      where: { productId: id },
      transaction
    })

    await transaction.commit()
    return product
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, error.status)
  }
}

const sendProductToBCCU = async ({ id, isVariant = false }) => {
  let product, urlImage, price, discountPrice

  if (isVariant) {
    const productVariant = await db.ProductVariant.findOne({
      where: { id },
      include: [{ model: db.Product, as: 'product' }]
    })
    if (!productVariant || !productVariant.product) throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)

    product = productVariant.product
    urlImage = productVariant.imageUrl || null
    price = productVariant.originalPrice
    discountPrice = productVariant.salePrice ?? productVariant.originalPrice
  } else {
    product = await db.Product.findByPk(id)
    if (!product) throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)

    try {
      const imagesArr = Array.isArray(product.imagesUrl) ? product.imagesUrl : JSON.parse(product.imagesUrl || '[]')
      urlImage = imagesArr[0] || null
    } catch {
      urlImage = null
    }
    price = product.originalPrice
    discountPrice = product.salePrice ?? product.originalPrice
  }

  const companyId = process.env.BCCU_COMPANY_ID
  const secretKey = process.env.BCCU_SECRET_KEY

  if (!companyId) throw new ServiceException({ companyId: 'Mã công ty không tồn tại' }, STATUS_CODE.NOT_FOUND)

  const productDataToSent = {
    name: product.name,
    slug: product.slug,
    description: product.content,
    price,
    discountPrice,
    urlImage,
    madeBy: 'KATEC',
    priority: 0,
    unit: product.unit,
    companyId
  }

  const secret = process.env.BCCU_SIGNATURE
  const signature = generateCloudSignature(secret)
  const generateToken = jwt.sign({ raw: JSON.stringify(productDataToSent) }, secretKey)
  const BCCUApi = createBCCUApi(generateToken, signature)

  try {
    const res = await BCCUApi.post('/product-create-with-token/', productDataToSent)
    if (res.status === 200) {
      await product.update({
        sentBccuCount: (product.sentBccuCount || 0) + 1
      })
    }
    return true
  } catch (e) {
    const status = e.response?.status
    const messages = e.response?.data?.messages || e.response?.data || e.message

    if (status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      throw new ServiceException(messages, status)
    }
    throw new ServiceException(messages, status || STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getPublicProducts = async (query) => {
  return await getProducts({ ...query, isPublic: true })
}

const getProductsByCustomer = async (customerId) => {
  try {
    const customer = await db.User.findByPk(customerId, {
      include: {
        model: db.CustomerGroup,
        as: 'customerGroup',
        include: {
          model: db.CustomerGroupDiscount,
          as: 'discounts'
        }
      }
    })

    if (!customer) {
      throw new ServiceException('Khách hàng không tồn tại', STATUS_CODE.NOT_FOUND)
    }

    const products = await db.Product.findAll()
    const discounts = customer.customerGroup?.discounts || []

    const mapped = products.map((prod) => {
      const discount = discounts.find((d) => d.productId === prod.id)
      let finalPrice = prod.salePrice

      if (discount) {
        if (discount.type === 'percentage') {
          finalPrice = prod.originalPrice * (1 - discount.value / 100)
        } else if (discount.type === 'fixed') {
          finalPrice = prod.originalPrice - discount.value
        }
      }

      return {
        ...prod.toJSON(),
        currentPrice: finalPrice
      }
    })

    return mapped
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getProductPriceHistoryByCustomer = async (customerId, productId) => {
  try {
    const product = await db.Product.findByPk(productId)
    if (!product) {
      throw new ServiceException('Sản phẩm không tồn tại', STATUS_CODE.NOT_FOUND)
    }

    const histories = await db.CustomerGroupDiscountHistory.findAll({
      where: { productId, customerId },
      include: [{ model: db.User, as: 'updatedUser', attributes: ['id', 'full_name', 'email'] }],
      order: [['createdAt', 'DESC']]
    })

    return histories.map((h) => {
      let reason = 'Thay đổi giá gốc'
      if (h.type === 'percentage') {
        reason = `Giảm ${h.value}%`
      } else if (h.type === 'fixed') {
        reason = `Giảm ${h.value} đ`
      }

      return {
        id: h.id,
        oldValue: h.oldValue,
        newValue: h.newValue,
        type: h.type,
        value: h.value,
        reason,
        createdAt: h.createdAt,
        updatedUser: h.updatedUser
      }
    })
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}


module.exports = {
  createProduct,
  getProducts,
  getVariants,
  getProductById,
  getProductBySlug,
  updateProductStatus,
  updateProduct,
  deleteProduct,
  sendProductToBCCU,
  getPublicProducts,
  getProductsByCustomer,
  getProductPriceHistoryByCustomer
}
