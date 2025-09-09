const getDateNow = () => {
    const now = new Date(Math.floor(Date.now()))
    const day = ('0' + now.getDate()).slice(-2)
    const month = ('0' + (now.getMonth() + 1)).slice(-2)
    const year = now.getFullYear()

    const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
    const hours = now.getHours()
    const min = now.getMinutes()
    const sec = now.getSeconds()
    const idDay = now.getDay()

    return {
        timestamp: Math.floor(Date.now() / 1000),
        day,
        month,
        year,
        time,
        hours,
        min,
        sec,
        idDay
    }
}

module.exports = getDateNow
