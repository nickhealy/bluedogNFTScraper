const cron = require('node-cron')
const { getNftData } = require('./crawler')

function initCronJob() {
    cron.schedule('1 * * * *', async () =>{ 
        try {
            console.log("starting crawler...")
            await getNftData()
        } catch (e) {
            console.error(e)
        }
    })
}

module.exports = {
    initCronJob
}