const { body, param } = require("express-validator");
const { message } = require("../../../constants/message");
const { validateVietnamesePhone } = require("../../../validates/ValidateOther");
const db = require("../../../models");

const validateBody = [
    body('name')
        .notEmpty()
        .withMessage(message.notEmpty)
        .bail()
        .isLength({ min: 3, max: 255 })
        .withMessage(message.isLength(3, 255)),
    body('contactPerson')
        .notEmpty()
        .withMessage(message.notEmpty)
        .bail()
        .isLength({ min: 3, max: 255 })
        .withMessage(message.isLength(3, 255)),
]
const validateParams = [
    param('id')
        .custom(async (id) => {
            const supplier = await db.Supplier.findByPk(id)
            if (!supplier) {
                throw new Error(message.notFound)
            }
            return true
        })
]
const create = [
    ...validateBody,
    body('email')
        .notEmpty()
        .withMessage(message.notEmpty)
        .bail()
        .isEmail()
        .withMessage(message.isEmail)
        .bail()
        .custom(async (email) => {
            const existingEmail = await db.Supplier.findOne({
                where: { email }
            })
            if (existingEmail) {
                throw new Error(message.isExisted)
            }
            return true
        }),
    body('phoneNumber')
        .custom(async (phone) => {
            if (!validateVietnamesePhone(phone)) {
                throw new Error(message.invalidPhone)
            }
            const existingPhone = await db.Supplier.findOne({
                where: { phoneNumber: phone }
            })
            if (existingPhone) {
                throw new Error(message.isExisted)
            }
            return true
        })
]

const update = [
    ...validateBody,
    ...validateParams,
    body('email')
        .notEmpty()
        .withMessage(message.notEmpty)
        .bail()
        .isEmail()
        .withMessage(message.isEmail)
        .bail()
        .custom(async (email, { req }) => {
            const existingEmail = await db.Supplier.findOne({
                where: { email, id: { [db.Sequelize.Op.ne]: req.params.id } }
            })
            if (existingEmail) {
                throw new Error(message.isExisted)
            }
            return true
        }),
    body('phoneNumber')
        .custom(async (phone, { req }) => {
            if (!validateVietnamesePhone(phone)) {
                throw new Error(message.invalidPhone)
            }
            const existingPhone = await db.Supplier.findOne({
                where: { phoneNumber: phone, id: { [db.Sequelize.Op.ne]: req.params.id } }
            })
            if (existingPhone) {
                throw new Error(message.isExisted)
            }
            return true
        })
]

const destroy = [
    ...validateParams,
    param('id')
        .custom(async (id) => {
            const isUsed = await db.Batch.findOne({
                where: { supplierId: id }
            })
            if (isUsed) {
                throw new Error('Nhà cung cấp đang được sử dụng')
            }
            return true
        })
]

const SupplierValidate = {
    create,
    update,
    validateParams,
    destroy
}

module.exports = SupplierValidate