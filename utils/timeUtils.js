const {DateTime} = require('luxon')

const toJakartaTime = (date) => {
    return DateTime.fromJSDate(date, { zone: 'utc'})
        .setZone('Asia/Jakarta')
        .toJSDate()
}

module.exports = {toJakartaTime}