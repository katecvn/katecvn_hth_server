const transporter = require('../../../config/mail')
const db = require('../../../models')

const getContacts = async (data) => {
  const { page = 1, limit = 9999, keyword } = data
  const offset = (page - 1) * limit
  const conditions = {}

  if (keyword) {
    conditions[db.Sequelize.Op.or] = [{ name: { [db.Sequelize.Op.like]: `%${keyword}%` } }, { subject: { [db.Sequelize.Op.like]: `%${keyword}%` } }]
  }

  const { count, rows: contacts } = await db.Contact.findAndCountAll({
    offset,
    limit,
    conditions,
    distinct: true
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    contacts
  }
}

const getContactById = async (id) => {
  return await db.Contact.findByPk(id)
}

const createContact = async (data) => {
  const { name, email, phone, subject, message } = data

  const transaction = await db.sequelize.transaction()
  try {
    const contact = await db.Contact.create(
      {
        name,
        email,
        phone,
        subject,
        message
      },
      { transaction }
    )
    await transaction.commit()
    return contact
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updateStatus = async (id, status) => {
  const contact = await db.Contact.findByPk(id)

  const transaction = await db.sequelize.transaction()
  try {
    await contact.update(
      {
        status
      },
      { transaction }
    )
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}
const deleteById = async (id) => {
  const contact = await db.Contact.findByPk(id)

  const transaction = await db.sequelize.transaction()
  try {
    await contact.destroy({ transaction })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const sendEmail = async (fromEmail, toEmail, subject, content) => {

  try {
    return await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: subject,
      html: content
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateStatus,
  deleteById,
  sendEmail
}
