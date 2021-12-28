const cron = require('node-cron')
const { getNftData } = require('./crawler')

function initCronJob() {
    cron.schedule('5 * * * *', async () =>{ 
        try {
            await getNftData()
        } catch (e) {
            console.error(e)
        }
    })
}

module.exports = {
    initCronJob
}