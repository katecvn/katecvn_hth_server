const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')
const { Op } = require('sequelize')

const createRecruitAttributeAssignment = async ({ recruitPostId, attributeId, attributeValueId, customValue }) => {
  try {
    return await db.RecruitAttributeAssignment.create({
      recruitPostId,
      attributeId,
      attributeValueId,
      customValue
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAllRecruitAttributeAssignments = async () => {
  try {
    const assignments = await db.RecruitAttributeAssignment.findAll({
      include: [
        { model: db.RecruitPost, as: 'recruitPost' },
        { model: db.RecruitAttribute, as: 'attribute' },
        { model: db.RecruitAttributesValue, as: 'value' }
      ],
      order: [['id', 'DESC']]
    })
    return assignments
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getRecruitAttributeAssignmentById = async (id) => {
  try {
    const record = await db.RecruitAttributeAssignment.findByPk(id, {
      include: [
        { model: db.RecruitPost, as: 'recruitPost' },
        { model: db.RecruitAttribute, as: 'attribute' },
        { model: db.RecruitAttributesValue, as: 'value' }
      ]
    })

    if (!record) {
      throw new ServiceException('RecruitAttributeAssignment not found', STATUS_CODE.NOT_FOUND)
    }

    return record
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateRecruitAttributeAssignment = async (id, data) => {
  try {
    const record = await db.RecruitAttributeAssignment.findByPk(id)
    if (!record) {
      throw new ServiceException('RecruitAttributeAssignment not found', STATUS_CODE.NOT_FOUND)
    }

    await record.update({
      recruitPostId: data.recruitPostId,
      attributeId: data.attributeId,
      attributeValueId: data.attributeValueId,
      customValue: data.customValue
    })

    return record
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteRecruitAttributeAssignment = async (id) => {
  try {
    const record = await db.RecruitAttributeAssignment.findByPk(id)
    if (!record) {
      throw new ServiceException('RecruitAttributeAssignment not found', STATUS_CODE.NOT_FOUND)
    }

    await record.destroy()
    return true
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAllByRecruitPostId = async (recruitPostId) => {
  try {
    return await db.RecruitAttributeAssignment.findAll({
      where: { recruitPostId },
      include: [
        { model: db.RecruitAttribute, as: 'attribute' },
        { model: db.RecruitAttributesValue, as: 'value' }
      ],
      order: [['id', 'ASC']]
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAssignmentsByAttributeId = async (attributeId) => {
  try {
    return await db.RecruitAttributeAssignment.findAll({
      where: { attributeId },
      include: [
        { model: db.RecruitPost, as: 'recruitPost' },
        { model: db.RecruitAttributesValue, as: 'value' }
      ],
      order: [['id', 'ASC']]
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const bulkCreateOrUpdateAssignments = async (recruitPostId, assignments) => {
  // assignments = [{attributeId, attributeValueId, customValue}]
  const t = await db.sequelize.transaction()
  try {
    await db.RecruitAttributeAssignment.destroy({ where: { recruitPostId }, transaction: t })
    for (const item of assignments) {
      await db.RecruitAttributeAssignment.create(
        {
          recruitPostId,
          attributeId: item.attributeId,
          attributeValueId: item.attributeValueId,
          customValue: item.customValue
        },
        { transaction: t }
      )
    }
    await t.commit()
    return true
  } catch (error) {
    await t.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteAllByRecruitPostId = async (recruitPostId) => {
  try {
    return await db.RecruitAttributeAssignment.destroy({ where: { recruitPostId } })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAssignmentsByRecruitPostIds = async (recruitPostIds) => {
  try {
    const assignments = await db.RecruitAttributeAssignment.findAll({
      where: { recruitPostId: { [Op.in]: recruitPostIds } },
      include: [
        { model: db.RecruitAttribute, as: 'attribute' },
        { model: db.RecruitAttributesValue, as: 'value' }
      ],
      order: [
        ['recruitPostId', 'ASC'],
        ['id', 'ASC']
      ]
    })
    const result = {}
    for (const a of assignments) {
      if (!result[a.recruitPostId]) result[a.recruitPostId] = []
      result[a.recruitPostId].push(a)
    }
    return result
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const checkAssignmentExist = async ({ recruitPostId, attributeId }) => {
  try {
    const exist = await db.RecruitAttributeAssignment.findOne({
      where: { recruitPostId, attributeId }
    })
    return !!exist
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteByRecruitPostAndAttributeId = async (recruitPostId, attributeId) => {
  try {
    return await db.RecruitAttributeAssignment.destroy({
      where: { recruitPostId, attributeId }
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const countAssignmentsByRecruitPostId = async (recruitPostId) => {
  try {
    return await db.RecruitAttributeAssignment.count({ where: { recruitPostId } })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const filterAssignments = async (filter) => {
  try {
    const where = {}
    if (filter.recruitPostId) where.recruitPostId = filter.recruitPostId
    if (filter.attributeId) where.attributeId = filter.attributeId
    if (filter.attributeValueId) where.attributeValueId = filter.attributeValueId
    if (filter.customValue) where.customValue = filter.customValue
    return await db.RecruitAttributeAssignment.findAll({
      where,
      include: [
        { model: db.RecruitPost, as: 'recruitPost' },
        { model: db.RecruitAttribute, as: 'attribute' },
        { model: db.RecruitAttributesValue, as: 'value' }
      ],
      order: [['id', 'ASC']]
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  createRecruitAttributeAssignment,
  getAllRecruitAttributeAssignments,
  getRecruitAttributeAssignmentById,
  updateRecruitAttributeAssignment,
  deleteRecruitAttributeAssignment,
  getAllByRecruitPostId,
  getAssignmentsByAttributeId,
  bulkCreateOrUpdateAssignments,
  deleteAllByRecruitPostId,
  getAssignmentsByRecruitPostIds,
  checkAssignmentExist,
  deleteByRecruitPostAndAttributeId,
  countAssignmentsByRecruitPostId,
  filterAssignments
}
