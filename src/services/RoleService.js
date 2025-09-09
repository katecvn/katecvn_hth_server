const { Op } = require('sequelize')
const { STATUS_CODE } = require('../constants')
const ServiceException = require('../exceptions/ServiceException')
const { Role } = require('../models')

const db = require('../models')

const RoleService = {
  async getAllRoles(page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit

      const { count, rows: roles } = await Role.findAndCountAll({ limit: limit, offset: offset })

      return { totalItems: count, roles: roles, totalPages: Math.ceil(count / limit), currentPage: page }
    } catch (error) {
      throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
    }
  },

  async getRoleById({ id }) {
    return await db.Role.findOne({ where: { id: id }, include: [{ model: db.Permission, as: 'permissions', attributes: ['id', 'name'] }] })
  },

  async createRole({ name, description, permissionIds }) {
    try {
      return db.sequelize.transaction(async (t) => {
        const role = await db.Role.create({ name, description }, { t })

        if (permissionIds?.length) {
          const rolePermissions = permissionIds.map((permissionId) => ({ role_id: role.id, permission_id: permissionId }))

          await db.RoleHasPermission.bulkCreate(rolePermissions, { t })
        }

        return role
      })
    } catch (e) {
      console.log('e>>', e)
      throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
    }
  },

  async updateRole(id, { name, description, permissionIds }) {
    return db.sequelize.transaction(async (t) => {
      const role = await db.Role.findByPk(id, { t })
      if (!role) return false

      await role.update({ name, description }, { t })

      // Xóa hết permissions cũ
      await db.RoleHasPermission.destroy({ where: { role_id: id }, t })

      // Thêm permissions mới
      if (permissionIds?.length) {
        const rolePermissions = permissionIds.map((permissionId) => ({ role_id: id, permission_id: permissionId }))
        await db.RoleHasPermission.bulkCreate(rolePermissions, { t })
      }

      // // Logout tất cả các user có role_id = id
      const userHasRoles = await db.UserHasRole.findAll({ where: { role_id: id } })
      const userIds = userHasRoles.map(userHasRole => userHasRole.user_id)

      if (userIds.length > 0) {
        await db.AccessLog.update(
          { logoutAt: new Date() },
          {
            where: {
              user_id: { [Op.in]: userIds },
              logoutAt: null
            }
          },
          { t }
        )
      }

      return true
    })
  },

  async deleteRole(roleId) {
    return await Role.destroy({ where: { id: roleId } }) // Soft delete
  },

  async getRoleByName({ name, notInIds = [] }) {
    try {
      const whereClause = { name }

      if (notInIds.length) {
        whereClause.id = { [db.Sequelize.Op.notIn]: notInIds }
      }

      const role = await Role.findOne({ where: whereClause })
      return role
    } catch (e) {
      throw new Error(e.message)
    }
  }
}

module.exports = RoleService
