const { body, param } = require("express-validator");
const { RECEIPT_STATUS } = require("../../../constants");
const { message } = require("../../../constants/message");
const db = require("../../../models");

const updateStatus = [
    param('id')
        .custom(async (id) => {
            const receipt = await db.InventoryReceipt.findOne({
                where: { id },
                attributes: ['status']
            })
            if (!receipt) {
                throw new Error(message.notExist)
            }
            if (receipt.status === RECEIPT_STATUS.COMPLETED) {
                throw new Error('Phiếu nhập/xuất kho đã được duyệt')
            }
            return true
        }),
    body('status')
        .isIn(Object.values(RECEIPT_STATUS))
        .withMessage(message.isIn(Object.values(RECEIPT_STATUS)))
]

module.exports = {
    updateStatus
}