const express = require('express')
const RewardPointHistoryController = require('../controllers/rewardPointHistory.controller')
const RewardPointHistoryValidate = require('../validations/rewardPointHistory.validation')
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const PERMISSIONS = require('../../../constants/permission')

const router = express.Router()

router.get(
  '/reward-point-histories',
  authenticate,
  authorize([PERMISSIONS.REWARD_HISTORY_VIEW]),
  RewardPointHistoryValidate.getHistories,
  validate,
  RewardPointHistoryController.getHistories
)

module.exports = router
