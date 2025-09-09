const moment = require('moment')

const convertDateFormat = (fromDate, toDate) => {
    const startDate = moment.tz(fromDate, 'Asia/Ho_Chi_Minh').startOf('day').toDate()
    const endDate = moment.tz(toDate, 'Asia/Ho_Chi_Minh').endOf('day').toDate()

    return { startDate, endDate }
}

module.exports = convertDateFormat