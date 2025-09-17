const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const RewardPointRuleService = require('../services/rewardPointRule.service')

const getRules = async (req, res, next) => {
  try {
    const data = await RewardPointRuleService.getRules(req.query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, data)
  } catch (error) {
    next(error)
  }
}

const createRule = async (req, res, next) => {
  try {
    const rule = await RewardPointRuleService.createRule(req.body)
    return http.json(res, 'Thành công', STATUS_CODE.OK, rule)
  } catch (error) {
    next(error)
  }
}

const updateRule = async (req, res, next) => {
  const { id } = req.params
  try {
    await RewardPointRuleService.updateRule(id, req.body)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteRule = async (req, res, next) => {
  const { id } = req.params
  try {
    await RewardPointRuleService.deleteRule(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getRules,
  createRule,
  updateRule,
  deleteRule,
}
