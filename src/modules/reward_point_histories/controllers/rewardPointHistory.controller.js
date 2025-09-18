const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')
const RewardPointHistoryService = require('../services/rewardPointHistory.service')

const getHistories = async (req, res, next) => {
  try {
    const data = await RewardPointHistoryService.getHistories(req.query)
    return http.json(res, 'Thành công', STATUS_CODE.OK, data)
  } catch (error) {
    next(error)
  }
}

const getHistoriesByUser = async (req, res, next) => {
  try {
    const userId = req.user.id
    const data = await RewardPointHistoryService.getHistoriesByUser({
      ...req.query,
      userId,
    })
    return http.json(res, 'Thành công', STATUS_CODE.OK, data)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getHistories,
  getHistoriesByUser,
}
