const db = require('../models')

const createPageSection = async (data) => {
  return db.PageSection.create(data)
}

const getPageSectionById = async ({ id }) => {
  return db.PageSection.findOne({ where: { id } })
}

const getAllPageSections = async ({ pageId, pageSlug, sectionType }) => {
  let conditions = {}

  if (pageId) conditions.pageId = pageId

  if (pageSlug) {
    const page = await db.Page.findOne({ where: { slug: pageSlug } })
    if (page) conditions.pageId = page.id
  }

  if (sectionType) conditions.sectionType = sectionType

  return db.PageSection.findAll({ where: conditions, include: [{ model: db.Page, as: 'page', attributes: ['id', 'parentId', 'title', 'slug'] }] })
}

const updatePageSection = async (id, data) => {
  return db.PageSection.update(data, { where: { id } })
}

const deletePageSection = async (id) => {
  return db.PageSection.destroy({ where: { id } })
}

module.exports = { createPageSection, getPageSectionById, getAllPageSections, deletePageSection, updatePageSection }
