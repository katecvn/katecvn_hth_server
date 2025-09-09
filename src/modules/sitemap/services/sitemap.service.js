const db = require('../../../models')
const getDynamicRoutes = async () => {
  const [menuRoutes, topicRoutes, postRoutes, productRoutes] = await Promise.all([
    getMenuRoutes(),
    getTopicRoutes(),
    getPostRoutes(),
    getProductRoutes()
  ])

  const combined = [...menuRoutes, ...topicRoutes, ...postRoutes, ...productRoutes]

  // Lọc trùng URL và những URL không hợp lệ
  const uniqueRoutes = Array.from(
    new Map(
      combined
        .filter(
          (r) =>
            r.url && // không null
            !r.url.includes('no-data') && // không phải trang placeholder
            !r.url.includes('//') // không lỗi URL
        )
        .map((r) => [r.url, r]) // key: url
    ).values()
  )

  // Sắp xếp theo priority giảm dần
  return uniqueRoutes.sort((a, b) => b.priority - a.priority)
}

const getTopicRoutes = async () => {
  const topics = await db.Topic.findAll({
    attributes: ['slug']
  })

  const topicRoutes = topics.map((topic) => ({
    url: `/${topic.slug}`,
    changefreq: 'weekly',
    priority: 0.8
  }))

  return topicRoutes
}

const getPostRoutes = async () => {
  const posts = await db.Post.findAll({
    include: [
      {
        model: db.Topic,
        as: 'topics',
        attributes: ['slug']
      }
    ],
    attributes: ['slug']
  })

  const postRoutes = posts.map((post) => ({
    url: `/tin-tuc/${post.slug}`,
    priority: 0.7
  }))

  return postRoutes
}

const getMenuRoutes = async () => {
  const menus = await db.NavigationMenu.findAll({
    include: [
      {
        model: db.NavigationMenu,
        as: 'children',
        include: [
          {
            model: db.NavigationMenu,
            as: 'children',
            include: [{ model: db.NavigationMenu, as: 'children' }],
            order: [['position', 'ASC']]
          }
        ],
        order: [['position', 'ASC']]
      },
      {
        model: db.NavigationMenu,
        as: 'parent',
        required: false
      }
    ],
    order: [['position', 'ASC']]
  })

  const menuRoutes = menus.map((menu) => {
    const normalizedUrl = menu.url === '/home' ? '/' : menu.url

    return {
      url: normalizedUrl,
      changefreq: 'weekly',
      priority: normalizedUrl === '/' ? 1.0 : 0.9
    }
  })

  return menuRoutes
}

const getProductRoutes = async () => {
  const products = await db.Product.findAll({
    attributes: ['slug']
  })

  const productRoutes = products.map((product) => ({
    url: `san-pham/${product.slug}`,
    changefreq: 'weekly',
    priority: 0.7
  }))

  return productRoutes
}

module.exports = {
  getDynamicRoutes
}
