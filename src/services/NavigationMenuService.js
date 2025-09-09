const db = require('../models')

const createMenu = async (data) => {
  return await db.NavigationMenu.create(data)
}

const getMenuById = async ({ id }) => {
  return await db.NavigationMenu.findOne({ where: { id }, include: [{ model: db.NavigationMenu, as: 'children', required: false }] })
}

const getAllMenus = async () => {
  return await db.NavigationMenu.findAll({
    include: [
      {
        model: db.NavigationMenu,
        as: 'children',
        include: [
          { model: db.NavigationMenu, as: 'children', include: [{ model: db.NavigationMenu, as: 'children' }], order: [['position', 'ASC']] }
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
}

const updateMenu = async (id, data) => {
  return await db.NavigationMenu.update(data, { where: { id } })
}

const deleteMenu = async (id) => {
  return await db.NavigationMenu.destroy({ where: { id } })
}

module.exports = { createMenu, getMenuById, getAllMenus, updateMenu, deleteMenu }
