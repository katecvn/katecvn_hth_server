const express = require('express')
const RewardPointHistoryController = require('../controllers/rewardPointHistory.controller')
const RewardPointHistoryValidate = require('../validations/rewardPointHistory.validation')
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const PERMISSIONS = require('../../../constants/permission')

const router = express.Router()

// Admin xem toàn bộ lịch sử
router.get(
  '/reward-point-histories',
  authenticate,
  authorize([PERMISSIONS.REWARD_POINT_HISTORY_LIST_VIEW]),
  RewardPointHistoryValidate.getHistories,
  validate,
  RewardPointHistoryController.getHistories
)

// User xem lịch sử của riêng mình
router.get(
  '/reward-point-histories/me',
  authenticate,
  authorize([PERMISSIONS.REWARD_HISTORY_VIEW]),
  RewardPointHistoryValidate.getHistories,
  validate,
  RewardPointHistoryController.getHistoriesByUser
)

module.exports = router
