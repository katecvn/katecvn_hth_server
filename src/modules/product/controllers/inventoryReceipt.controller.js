const { STATUS_CODE } = require("../../../constants")
const http = require("../../../utils/http")
const ReceiptService = require("../services/inventoryReceipt.service")

const createReceipt = async (req, res, next) => {
    const data = req.body
    const { user } = req

    try {
        await ReceiptService.createReceipt(data, { id: user.id })
        return http.json(res, 'Thành công', STATUS_CODE.OK)
    } catch (error) {
        next(error)
    }
}

const getAllReceipts = async (req, res, next) => {
    const { page, limit, fromDate, toDate } = req.query
    try {
        const receipts = await ReceiptService.getAllReceipts({ page, limit, fromDate, toDate })
        return http.json(res, 'Thành công', STATUS_CODE.OK, receipts)
    } catch (error) {
        next(error)
    }
}

const getReceiptById = async (req, res, next) => {
    const { id } = req.params
    try {
        const receipt = await ReceiptService.getReceiptById(id)
        return http.json(res, 'Thành công', STATUS_CODE.OK, receipt)
    } catch (error) {
        next(error)
    }
}

const updateReceipt = async (req, res, next) => {
    const data = req.body
    const { id } = req.params
    try {
        await ReceiptService.updateReceipt(id, data, { id: req.user.id })
        return http.json(res, 'Cập nhật thành công', STATUS_CODE.OK)
    } catch (error) {
        next(error)
    }
}

const updateReceiptStatus = async (req, res, next) => {
    const { user } = req
    const data = req.body
    const { id } = req.params

    try {
        await ReceiptService.updateReceiptStatus(id, data, { id: user.id })
        return http.json(res, 'Thành công', STATUS_CODE.OK)
    } catch (error) {
        next(error)
    }
}

const deleteReceipt = async (req, res, next) => {
    const { id } = req.params

    try {
        await ReceiptService.deleteReceipt(id)
        return http.json(res, 'Xóa thành công', STATUS_CODE.OK)
    } catch (error) {
        next(error)
    }
}

const ReceiptController = {
    getAllReceipts,
    getReceiptById,
    createReceipt,
    updateReceipt,
    updateReceiptStatus,
    deleteReceipt
}

module.exports = ReceiptController