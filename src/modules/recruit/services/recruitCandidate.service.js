const { QueryTypes, Op } = require('sequelize')
const { sequelize } = require('../../../models')
const db = require('../../../models')
const ServiceException = require('../../../exceptions/ServiceException')
const { STATUS_CODE } = require('../../../constants')

const createRecruitCandidate = async (data) => {
  try {
    data.status = 'new'
    return await db.RecruitCandidate.create(data)
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

/**
 * [NEW] Tạo ứng viên + gán thuộc tính động trong 1 transaction
 * @param {object} data - Dữ liệu ứng viên, gồm field tĩnh + attributes động
 * {
 *   fullName, phone, email, ... // các field tĩnh
 *   attributes: [
 *     { attributeId, attributeValueId },
 *     { attributeId, customValue }
 *   ]
 * }
 */
const fullCreateCandidate = async (data) => {
  const t = await db.sequelize.transaction()
  try {
    data.status = 'new'
    const { attributes = [], ...candidateData } = data

    const candidate = await db.RecruitCandidate.create(candidateData, { transaction: t })

    for (const attr of attributes) {
      await db.CandidateAttributesAssignment.create(
        {
          candidateId: candidate.id,
          attributeId: attr.attributeId,
          attributeValueId: attr.attributeValueId,
          customValue: attr.customValue
        },
        { transaction: t }
      )
    }

    await t.commit()

    return await db.RecruitCandidate.findByPk(candidate.id, {
      include: [
        {
          model: db.CandidateAttributesAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        }
      ]
    })
  } catch (error) {
    await t.rollback()
    throw error
  }
}

/**
 * [NEW] Cập nhật ứng viên + thuộc tính động trong 1 transaction
 * @param {number} id - ID ứng viên
 * @param {object} data - Dữ liệu update, gồm field tĩnh + attributes động
 */
const fullUpdateCandidate = async (id, data) => {
  const t = await db.sequelize.transaction()
  try {
    const { attributes = [], ...candidateData } = data

    const candidate = await db.RecruitCandidate.findByPk(id, { transaction: t })
    if (!candidate) throw new ServiceException('Candidate not found', STATUS_CODE.NOT_FOUND)

    await candidate.update(candidateData, { transaction: t })

    await db.CandidateAttributesAssignment.destroy({ where: { candidateId: id }, transaction: t })

    for (const attr of attributes) {
      await db.CandidateAttributesAssignment.create(
        {
          candidateId: id,
          attributeId: attr.attributeId,
          attributeValueId: attr.attributeValueId,
          customValue: attr.customValue
        },
        { transaction: t }
      )
    }

    await t.commit()

    return await db.RecruitCandidate.findByPk(id, {
      include: [
        {
          model: db.CandidateAttributesAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        }
      ]
    })
  } catch (error) {
    await t.rollback()
    throw error
  }
}

const getAllRecruitCandidates = async ({ page = 1, limit = 10, search, recruitPostId }) => {
  try {
    const offset = (page - 1) * limit
    const where = {}

    if (search) {
      where[Op.or] = [{ candidateName: { [Op.like]: `%${search}%` } }, { candidatePhone: { [Op.like]: `%${search}%` } }]
    }
    if (recruitPostId) {
      where.recruitPostId = recruitPostId
    }

    const { count, rows } = await db.RecruitCandidate.findAndCountAll({
      where,
      include: [
        {
          model: db.CandidateAttributesAssignment,
          as: 'attributeAssignments',
          include: [
            { model: db.CandidateAttribute, as: 'attribute' },
            { model: db.CandidateAttributesValue, as: 'value' }
          ]
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true
    })

    return {
      totalItems: count,
      candidates: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getRecruitCandidateById = async (id) => {
  try {
    const result = await db.RecruitCandidate.findByPk(id, {
      include: [
        {
          model: db.CandidateAttributesAssignment,
          as: 'attributeAssignments',
          include: [
            { model: db.CandidateAttribute, as: 'attribute' },
            { model: db.CandidateAttributesValue, as: 'value' }
          ]
        }
      ]
    })

    if (!result) {
      throw new ServiceException('RecruitCandidate not found', STATUS_CODE.NOT_FOUND)
    }
    return result
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateRecruitCandidate = async (id, data) => {
  try {
    const candidate = await db.RecruitCandidate.findByPk(id)
    if (!candidate) {
      throw new ServiceException('RecruitCandidate not found', STATUS_CODE.NOT_FOUND)
    }
    await candidate.update(data)
    return candidate
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteRecruitCandidate = async (id) => {
  try {
    const candidate = await db.RecruitCandidate.findByPk(id)
    if (!candidate) {
      throw new ServiceException('RecruitCandidate not found', STATUS_CODE.NOT_FOUND)
    }
    await candidate.destroy()
    return true
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getRecruitCandidatesByRecruitPost = async ({ recruitPostId, page = 1, limit = 10, search, status }) => {
  try {
    const offset = (page - 1) * limit
    const where = { recruitPostId }
    if (search) {
      where[Op.or] = [{ candidateName: { [Op.like]: `%${search}%` } }, { candidatePhone: { [Op.like]: `%${search}%` } }]
    }
    if (status) where.status = status

    const { count, rows } = await db.RecruitCandidate.findAndCountAll({
      where,
      include: [
        {
          model: db.CandidateAttributesAssignment,
          as: 'attributeAssignments',
          include: [
            { model: db.CandidateAttribute, as: 'attribute' },
            { model: db.CandidateAttributesValue, as: 'value' }
          ]
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true
    })

    return {
      totalItems: count,
      candidates: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getRecruitCandidatesByUser = async ({ userId, page = 1, limit = 10, search }) => {
  try {
    const offset = (page - 1) * limit
    const where = { userId }
    if (search) {
      where[Op.or] = [{ candidateName: { [Op.like]: `%${search}%` } }, { candidatePhone: { [Op.like]: `%${search}%` } }]
    }
    const { count, rows } = await db.RecruitCandidate.findAndCountAll({
      where,
      include: [
        {
          model: db.CandidateAttributesAssignment,
          as: 'attributeAssignments',
          include: [
            { model: db.CandidateAttribute, as: 'attribute' },
            { model: db.CandidateAttributesValue, as: 'value' }
          ]
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true
    })

    return {
      totalItems: count,
      candidates: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateRecruitCandidateStatus = async (id, status) => {
  try {
    const candidate = await db.RecruitCandidate.findByPk(id)
    if (!candidate) {
      throw new ServiceException('RecruitCandidate not found', STATUS_CODE.NOT_FOUND)
    }
    await candidate.update({ status })
    return candidate
  } catch (e) {
    throw e
  }
}

const bulkUpdateRecruitCandidateStatus = async ({ ids = [], status }) => {
  try {
    if (!Array.isArray(ids) || !status) throw new ServiceException('Invalid input', STATUS_CODE.BAD_REQUEST)
    await db.RecruitCandidate.update({ status }, { where: { id: { [Op.in]: ids } } })
    return true
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const restoreRecruitCandidate = async (id) => {
  try {
    const candidate = await db.RecruitCandidate.findByPk(id, { paranoid: false })
    if (!candidate) {
      throw new ServiceException('RecruitCandidate not found', STATUS_CODE.NOT_FOUND)
    }
    await candidate.restore()
    return candidate
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const permanentlyDeleteRecruitCandidate = async (id) => {
  try {
    const candidate = await db.RecruitCandidate.findByPk(id, { paranoid: false })
    if (!candidate) {
      throw new ServiceException('RecruitCandidate not found', STATUS_CODE.NOT_FOUND)
    }
    await candidate.destroy({ force: true })
    return true
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const countRecruitCandidatesByRecruitPost = async (recruitPostId) => {
  try {
    return await db.RecruitCandidate.count({ where: { recruitPostId } })
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const searchRecruitCandidates = async ({ keyword, status, recruitPostId, page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit
    const where = {}
    if (keyword) {
      where[Op.or] = [{ candidateName: { [Op.like]: `%${keyword}%` } }, { candidatePhone: { [Op.like]: `%${keyword}%` } }]
    }
    if (status) where.status = status
    if (recruitPostId) where.recruitPostId = recruitPostId

    const { count, rows } = await db.RecruitCandidate.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true
    })

    return {
      totalItems: count,
      candidates: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const filterRecruitCandidates = async (filter = {}, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit
    const replacements = {}
    const whereClauses = []
    const attributeConditions = []

    if (filter.recruitPostId) {
      whereClauses.push(`rc.recruitPostId = :recruitPostId`)
      replacements.recruitPostId = filter.recruitPostId
    }
    if (filter.status) {
      whereClauses.push(`rc.status = :status`)
      replacements.status = filter.status
    }
    if (filter.gender) {
      whereClauses.push(`rc.gender = :gender`)
      replacements.gender = filter.gender
    }
    if (filter.createdBy) {
      whereClauses.push(`rc.createdBy = :createdBy`)
      replacements.createdBy = filter.createdBy
    }
    if (filter.updatedBy) {
      whereClauses.push(`rc.updatedBy = :updatedBy`)
      replacements.updatedBy = filter.updatedBy
    }
    if (filter.candidateName) {
      whereClauses.push(`rc.candidateName LIKE :candidateName`)
      replacements.candidateName = `%${filter.candidateName}%`
    }
    if (filter.candidatePhone) {
      whereClauses.push(`rc.candidatePhone LIKE :candidatePhone`)
      replacements.candidatePhone = `%${filter.candidatePhone}%`
    }
    if (filter.candidateEmail) {
      whereClauses.push(`rc.candidateEmail LIKE :candidateEmail`)
      replacements.candidateEmail = `%${filter.candidateEmail}%`
    }
    if (filter.address) {
      whereClauses.push(`rc.address LIKE :address`)
      replacements.address = `%${filter.address}%`
    }

    if (filter.dateOfBirthFrom) {
      whereClauses.push(`rc.dateOfBirth >= :dobFrom`)
      replacements.dobFrom = filter.dateOfBirthFrom
    }
    if (filter.dateOfBirthTo) {
      whereClauses.push(`rc.dateOfBirth <= :dobTo`)
      replacements.dobTo = filter.dateOfBirthTo
    }

    const attributes = filter.attributes || []
    attributes.forEach((attr, index) => {
      const conds = [`caa.attributeId = :attrId${index}`]
      replacements[`attrId${index}`] = attr.attributeId

      if (attr.attributeValueId != null) {
        conds.push(`caa.attributeValueId = :attrValueId${index}`)
        replacements[`attrValueId${index}`] = attr.attributeValueId
      }

      if (attr.customValue != null && attr.customValue !== '') {
        conds.push(`caa.customValue = :customValue${index}`)
        replacements[`customValue${index}`] = attr.customValue
      }

      attributeConditions.push(`(${conds.join(' AND ')})`)
    })

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''
    const attrWhereSQL = attributeConditions.length ? `AND (${attributeConditions.join(' OR ')})` : ''
    const havingSQL = attributes.length ? `HAVING COUNT(DISTINCT caa.attributeId) = ${attributes.length}` : ''

    const rawQuery = `
      SELECT rc.id
      FROM recruitcandidate rc
      JOIN candidateattributesassignments caa ON rc.id = caa.candidateId
      ${whereSQL}
      ${attrWhereSQL}
      GROUP BY rc.id
      ${havingSQL}
      ORDER BY rc.createdAt DESC
      LIMIT :limit OFFSET :offset
    `
    replacements.limit = limit
    replacements.offset = offset

    const rawResults = await sequelize.query(rawQuery, {
      replacements,
      type: QueryTypes.SELECT
    })

    const ids = rawResults.map((r) => r.id)
    if (ids.length === 0) {
      return {
        totalItems: 0,
        candidates: [],
        totalPages: 0,
        currentPage: page
      }
    }

    const candidates = await db.RecruitCandidate.findAll({
      where: { id: ids },
      include: [
        {
          model: db.CandidateAttributesAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    return {
      totalItems: ids.length,
      candidates,
      totalPages: Math.ceil(ids.length / limit),
      currentPage: page
    }
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const countRecruitCandidateByStatus = async (recruitPostId) => {
  try {
    const statusList = await db.RecruitCandidate.findAll({
      where: { recruitPostId },
      attributes: ['status', [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'count']],
      group: ['status']
    })
    return statusList
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  createRecruitCandidate,
  getAllRecruitCandidates,
  getRecruitCandidateById,
  updateRecruitCandidate,
  deleteRecruitCandidate,
  getRecruitCandidatesByRecruitPost,
  getRecruitCandidatesByUser,
  updateRecruitCandidateStatus,
  bulkUpdateRecruitCandidateStatus,
  restoreRecruitCandidate,
  permanentlyDeleteRecruitCandidate,
  countRecruitCandidatesByRecruitPost,
  searchRecruitCandidates,
  filterRecruitCandidates,
  countRecruitCandidateByStatus,
  fullCreateCandidate,
  fullUpdateCandidate
}
