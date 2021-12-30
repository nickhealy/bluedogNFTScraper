const express = require('express')
const path = require('path')
const app = express()

// we keep env variables in heroku as well
if (process.env.NODE_ENV == 'development') {
  require('dotenv').config()
  console.log(process.env.S3_REGION)
}

const PORT = process.env.PORT || 8080;
const STATIC_FOLDER_PATH = path.join(__dirname, 'public')

app.use(express.static(STATIC_FOLDER_PATH));

app.get('/ping', (req, res) => {
  res.send("pong")
})
  
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})
