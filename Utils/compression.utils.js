const { createGzip } = require('node:zlib')
const { pipeline } = require('node:stream')

const fs = require('fs')

module.exports = {
  async initializeZlib(options) {
    try {
    } catch (e) {}
  },
  async compress(req, res, next) {
    try {
      const gzip = createGzip()
      res.writeHead(200, { 'content-encoding': 'gzip' })
      const readStream = fs.createReadStream('./haroon.txt')

      readStream.on('data', (a) => {
        console.log(Buffer.from(a))
      })
      var acceptEncoding = req.headers['accept-encoding']
      if (!acceptEncoding) {
        acceptEncoding = ''
      }
      readStream.pipe(gzip).pipe(res)
    } catch (e) {
      console.log(e.message)
    }
  },
}
