const express = require('express')
const path = require('path')

const app = express()

const PORT = process.env.PORT || 8080;
const STATIC_FOLDER_PATH = path.join(__dirname, 'public')

app.use(express.static(STATIC_FOLDER_PATH));

app.get('/ping', (req, res) => {
  res.send("pong")
})
  
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})
