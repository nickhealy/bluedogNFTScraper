const express = require('express')
const { initCronJob } = require('./crawler_scheduler')

const app = express()

const PORT = 8080;

app.use(express.static('public'))
  
app.listen(PORT, () => {
    initCronJob()
    console.log(`Listening at http://localhost:${PORT}`)
})
