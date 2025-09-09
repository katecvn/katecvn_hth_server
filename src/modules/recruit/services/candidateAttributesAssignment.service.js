const { Op } = require('sequelize')
const db = require('../../../models')
const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')

const createCandidateAttributeAssignment = async (data) => {
  try {
    return await db.CandidateAttributesAssignment.create(data)
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAllCandidateAttributeAssignments = async () => {
  try {
    return await db.CandidateAttributesAssignment.findAll({
      include: [
        { model: db.CandidateAttribute, as: 'attribute' },
        { model: db.CandidateAttributesValue, as: 'value' },
        { model: db.RecruitCandidate, as: 'candidate' }
      ]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getCandidateAttributeAssignmentById = async (id) => {
  try {
    const assignment = await db.CandidateAttributesAssignment.findByPk(id, {
      include: [
        { model: db.CandidateAttribute, as: 'attribute' },
        { model: db.CandidateAttributesValue, as: 'value' },
        { model: db.RecruitCandidate, as: 'candidate' }
      ]
    })
    if (!assignment) {
      throw new ServiceException('Assignment not found', STATUS_CODE.NOT_FOUND)
    }
    return assignment
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateCandidateAttributeAssignment = async (id, data) => {
  try {
    const assignment = await db.CandidateAttributesAssignment.findByPk(id)
    if (!assignment) {
      throw new ServiceException('Assignment not found', STATUS_CODE.NOT_FOUND)
    }
    await assignment.update(data)
    return assignment
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteCandidateAttributeAssignment = async (id) => {
  try {
    const assignment = await db.CandidateAttributesAssignment.findByPk(id)
    if (!assignment) {
      throw new ServiceException('Assignment not found', STATUS_CODE.NOT_FOUND)
    }
    await assignment.destroy()
    return true
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAssignmentsByCandidateId = async (candidateId) => {
  try {
    return await db.CandidateAttributesAssignment.findAll({
      where: { candidateId },
      include: [
        { model: db.CandidateAttribute, as: 'attribute' },
        { model: db.CandidateAttributesValue, as: 'value' }
      ]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAssignmentsByAttributeId = async (attributeId) => {
  try {
    return await db.CandidateAttributesAssignment.findAll({
      where: { attributeId },
      include: [
        { model: db.RecruitCandidate, as: 'candidate' },
        { model: db.CandidateAttributesValue, as: 'value' }
      ]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const bulkCreateOrUpdateAssignments = async (candidateId, assignments = []) => {
  const t = await db.sequelize.transaction()
  try {
    // assignments = [{ attributeId, attributeValueId, customValue }]
    for (const item of assignments) {
      const where = {
        candidateId,
        attributeId: item.attributeId
      }
      let record = await db.CandidateAttributesAssignment.findOne({ where, transaction: t })
      if (record) {
        await record.update({ attributeValueId: item.attributeValueId, customValue: item.customValue }, { transaction: t })
      } else {
        await db.CandidateAttributesAssignment.create(
          { candidateId, attributeId: item.attributeId, attributeValueId: item.attributeValueId, customValue: item.customValue },
          { transaction: t }
        )
      }
    }
    await t.commit()
    return true
  } catch (err) {
    await t.rollback()
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteAllByCandidateId = async (candidateId) => {
  try {
    await db.CandidateAttributesAssignment.destroy({ where: { candidateId } })
    return true
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const checkAssignmentExist = async ({ candidateId, attributeId, attributeValueId, customValue }) => {
  try {
    const where = { candidateId, attributeId }
    if (attributeValueId !== undefined) where.attributeValueId = attributeValueId
    if (customValue !== undefined) where.customValue = customValue
    const exist = await db.CandidateAttributesAssignment.findOne({ where })
    return !!exist
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAssignmentsByCandidateIds = async (candidateIds = []) => {
  try {
    return await db.CandidateAttributesAssignment.findAll({
      where: { candidateId: { [Op.in]: candidateIds } },
      include: [
        { model: db.CandidateAttribute, as: 'attribute' },
        { model: db.CandidateAttributesValue, as: 'value' }
      ]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteByCandidateAndAttributeId = async (candidateId, attributeId) => {
  try {
    await db.CandidateAttributesAssignment.destroy({
      where: { candidateId, attributeId }
    })
    return true
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const countAssignmentsByCandidateId = async (candidateId) => {
  try {
    return await db.CandidateAttributesAssignment.count({ where: { candidateId } })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const filterAssignments = async (filter = {}) => {
  try {
    const where = {}
    if (filter.candidateId) where.candidateId = filter.candidateId
    if (filter.attributeId) where.attributeId = filter.attributeId
    if (filter.attributeValueId) where.attributeValueId = filter.attributeValueId
    if (filter.customValue) where.customValue = filter.customValue
    return await db.CandidateAttributesAssignment.findAll({
      where,
      include: [
        { model: db.CandidateAttribute, as: 'attribute' },
        { model: db.CandidateAttributesValue, as: 'value' },
        { model: db.RecruitCandidate, as: 'candidate' }
      ]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  createCandidateAttributeAssignment,
  getAllCandidateAttributeAssignments,
  getCandidateAttributeAssignmentById,
  updateCandidateAttributeAssignment,
  deleteCandidateAttributeAssignment,
  getAssignmentsByCandidateId,
  getAssignmentsByAttributeId,
  bulkCreateOrUpdateAssignments,
  deleteAllByCandidateId,
  checkAssignmentExist,
  getAssignmentsByCandidateIds,
  deleteByCandidateAndAttributeId,
  countAssignmentsByCandidateId,
  filterAssignments
}
