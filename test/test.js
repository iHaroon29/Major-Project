const fs = require('fs')
const crypto = require('crypto')
const pipeline = require('node:stream')
const { createGzip } = require('node:zlib')
const gzip = createGzip()

;(async () => {
  try {
    const filename = 'test-data.txt'
    const randomData = crypto.randomBytes(512 * 1024).toString('hex')
    const writeStream = fs.createWriteStream(filename)
    writeStream.write(randomData)
    // const writeStreamCompressed = fs.createWriteStream('test-data.txt.gz')
    // const readStream = fs.createReadStream(filename)
    // readStream.pipe(gzip).pipe(writeStreamCompressed)
  } catch (e) {
    console.log(e.message)
  }
})()
