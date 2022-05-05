const express = require('express')
const Redis = require('ioredis')
const app = express()
const port = 3000

app.use(express.json())

const redis = new Redis()
redis.set('load', 0)

const uploadToS3 = () => new Promise(res => setTimeout(res, 3000));

// Available bandwidth is 20% of 200mbsp = 40mbsp
// Image load is 2000 pics/m = 33.33~ pics/s at .25mb per pic = 8.33~ mbsp load
const MAX_LOAD = 10000

app.post('/upload', async (req, res) => {
  var file = req.body.fileData
  var fileBitSize = file.length * 8
  
  var currLoad = parseInt(await redis.get('load'))
  console.log('currLoad ' , currLoad)
  console.log('maxLoad', MAX_LOAD)
  if (currLoad + fileBitSize > MAX_LOAD) {
    console.log('\u001b[1;31mRATE LIMITED')
    console.log('\u001b[0m')
    res.sendStatus(429)
    return
  }

  await redis.set('load', currLoad + fileBitSize)
  console.log('\u001b[1;32mUPLOAD STARTED')
  console.log('\u001b[0m')
  await uploadToS3();
  currLoad = await redis.get('load')
  await redis.set('load', currLoad - fileBitSize)

  res.sendStatus(200)
})

app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
})