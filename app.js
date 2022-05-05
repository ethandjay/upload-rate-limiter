const express = require('express')
const redis = require('redis')
const app = express()
const port = 3000

app.use(express.json())

const client = redis.createClient()
const LOAD_CAPACITY = 5000
client.connect()
client.set('load', LOAD_CAPACITY)

const uploadToS3 = () => new Promise(res => setTimeout(res, (Math.random() * 1000) + 500));

// Available bandwidth is 20% of 200mbsp = 40mbsp
// Image load is 2000 pics/m = 33.33~ pics/s at .25mb per pic = 8.33~ mbsp load

app.post('/upload', async (req, res) => {
  var file = req.body.fileData
  var fileBitSize = file.length * 8

  // lock 'load' key until conditional set ops complete
  client.watch('load')
  var availableLoad = parseInt(await client.get('load'))
  
  console.log('availableLoad ' , availableLoad)
  console.log('fileSize', fileBitSize)

  // If not enough resources are available to process request, return 429 Too Many Requests
  if (availableLoad - fileBitSize <= 0) {
    logRateLimited()

    client.unwatch()
    res.sendStatus(429)
    return
  }

  // Decrement resource pool by fileSize, return 429 if key is locked
  await client.multi().decrBy('load', fileBitSize).exec()
    .catch(() => {
      res.sendStatus(429)
      return
    })

  // Simulate S3 upload and replace resources on complete...
  logUploadStarted()
  await uploadToS3().then(() => {
    client.incrBy('load', fileBitSize)
  })

  res.sendStatus(200)
})

const logUploadStarted = () => {
  console.log('\u001b[1;32mUPLOAD STARTED')
  console.log('\u001b[0m')
}

const logRateLimited = () => {
  console.log('\u001b[1;31mRATE LIMITED')
  console.log('\u001b[0m')
}

app.listen(port)