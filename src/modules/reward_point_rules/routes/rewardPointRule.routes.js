const express = require('express')
const RewardPointRuleController = require('../controllers/rewardPointRule.controller')
const RewardPointRuleValidate = require('../validations/rewardPointRule.validation')
const { authenticate, authorize } = require('../../../middlewares/JWTAction')
const { validate } = require('../../../middlewares/Validate')
const PERMISSIONS = require('../../../constants/permission')

const router = express.Router()

router.get(
  '/reward-point-rules',
  authenticate,
  authorize([PERMISSIONS.SETTING_REWARD_RULE]),
  RewardPointRuleController.getRules
)

router.post(
  '/reward-point-rules',
  authenticate,
  authorize([PERMISSIONS.SETTING_REWARD_RULE]),
  RewardPointRuleValidate.create,
  validate,
  RewardPointRuleController.createRule
)

router.put(
  '/reward-point-rules/:id',
  authenticate,
  authorize([PERMISSIONS.SETTING_REWARD_RULE]),
  RewardPointRuleValidate.update,
  validate,
  RewardPointRuleController.updateRule
)

router.delete(
  '/reward-point-rules/:id',
  authenticate,
  authorize([PERMISSIONS.SETTING_REWARD_RULE]),
  RewardPointRuleController.deleteRule
)

module.exports = router
