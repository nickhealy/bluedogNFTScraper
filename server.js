const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

const PORT = 8080;

app.get('/', (req, res) => {
    const pathToData = path.join(__dirname, 'nft_data.json')
    const data = fs.readFileSync(pathToData)

    console.log("Sending")
    console.log(JSON.parse(data))
    res.send(data)
  })
  
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})
