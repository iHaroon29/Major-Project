require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET || 'secret'
const crypto = require('crypto')
const initVector = 'abcdefghijklmnop'
const securitykey = 'abcdefghijklmnopqrstuvwxyzABCDEF'
const cipher = crypto.createCipheriv('aes-256-cbc', securitykey, initVector)
const decipher = crypto.createDecipheriv('aes-256-cbc', securitykey, initVector)

module.exports = {
  async encryptData({ data, publicKey }) {
    try {
      const encryptedData = await publicKey.encrypt(data)
      return encryptedData
    } catch (e) {
      console.log(e.message)
    }
  },
  async decryptData({ data, privateKey }) {
    try {
      const decryptedData = await privateKey.decrypt(data)
      return decryptedData
    } catch (e) {
      console.log(e)
      console.log(e.message)
    }
  },
  async dataHashing(data) {
    try {
      return await bcrypt.hash(data, await bcrypt.genSalt(10))
    } catch (e) {
      console.log(e.message)
    }
  },
  async dataVerifying({ normalData, hashedData }) {
    try {
      return await bcrypt.compare(normalData, hashedData)
    } catch (e) {
      console.log(e.message)
    }
  },
  async jwtGeneration(data) {
    try {
      return jwt.sign({ data }, secret, { expiresIn: 4 * 60 * 60 })
    } catch (e) {
      console.log(e.message)
    }
  },
  async jwtVerification(token) {
    try {
      return jwt.verify(token, secret)
    } catch (e) {
      console.log(e.message)
    }
  },
  async testEncrypt(data) {
    try {
      let encryptedData = cipher.update(JSON.stringify(data), 'utf-8', 'hex')
      encryptedData += cipher.final('hex')
      return encryptedData
    } catch (e) {
      console.log(e)
      console.log(e.message)
    }
  },
  async testDecrypt(data) {
    try {
      let decryptedData = decipher.update(data, 'hex', 'utf-8')
      decryptedData += decipher.final('utf8')
      return decryptedData
    } catch (e) {
      console.log(e.message)
    }
  },
  async jwtDecoding(token) {
    try {
      return jwt.decode(token).data
    } catch (e) {
      console.log(e.message)
    }
  },
  async keyToObjectConverter(key) {
    try {
      const { n, _n2, g, lambda, mu, _p, _q } = key
      const keyObject = {}
      if (n && _n2 && g) {
        keyObject.n = n.toString()
        keyObject._n2 = _n2.toString()
        keyObject.g = g.toString()
      } else {
        keyObject.lambda = lambda.toString()
        keyObject.mu = mu.toString()
        keyObject._p = _p.toString()
        keyObject._q = _q.toString()
      }
      return keyObject
    } catch (e) {
      console.log(e)
      console.log(e.message)
    }
  },
  async objectToKey(key) {
    try {
    } catch (e) {
      console.log(e.message)
    }
  },
}
