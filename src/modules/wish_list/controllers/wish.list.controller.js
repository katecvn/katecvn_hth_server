const { STATUS_CODE } = require("../../../constants")
const http = require("../../../utils/http")
const WishListService = require("../services/wish.list.service")

const getWishListByUser = async (req, res, next) => {
    const { user } = req
    const query = req.query
    try {
        const wishlists = await WishListService.getWishListByUser(user.id, query)
        return http.json(res, 'Thành công', STATUS_CODE.OK, wishlists)
    } catch (error) {
        next(error)
    }
}

const addToWishList = async (req, res, next) => {
    const { id } = req.params
    const { user } = req

    try {
        await WishListService.addToWishList(user.id, id)
        return http.json(res, 'Thành công', STATUS_CODE.OK)
    } catch (error) {
        next(error)
    }
}

const removeFromWishList = async (req, res, next) => {
    const { user } = req
    const { id } = req.params

    try {
        await WishListService.removeFromWishList(user.id, id)
        return http.json(res, 'Thành công', STATUS_CODE.OK)
    } catch (error) {
        next(error)
    }
}

const WishListController = {
    addToWishList,
    getWishListByUser,
    removeFromWishList
}

module.exports = WishListController