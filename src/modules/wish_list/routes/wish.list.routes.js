const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const WishListController = require('../controllers/wish.list.controller')


router.get('/wish-list/shows', authenticate, WishListController.getWishListByUser)
router.post('/wish-list/:id', authenticate, WishListController.addToWishList)
router.delete('/wish-list/:id', authenticate, WishListController.removeFromWishList)

module.exports = router