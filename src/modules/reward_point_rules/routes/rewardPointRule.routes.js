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
  authorize([PERMISSIONS.REWARD_RULE_VIEW]),
  RewardPointRuleController.getRules
)

router.post(
  '/reward-point-rules',
  authenticate,
  authorize([PERMISSIONS.REWARD_RULE_CREATE]),
  RewardPointRuleValidate.create,
  validate,
  RewardPointRuleController.createRule
)

router.put(
  '/reward-point-rules/:id',
  authenticate,
  authorize([PERMISSIONS.REWARD_RULE_UPDATE]),
  RewardPointRuleValidate.update,
  validate,
  RewardPointRuleController.updateRule
)

router.delete(
  '/reward-point-rules/:id',
  authenticate,
  authorize([PERMISSIONS.REWARD_RULE_DELETE]),
  RewardPointRuleController.deleteRule
)

module.exports = router
