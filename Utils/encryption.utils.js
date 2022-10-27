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
  async encryptData(arguments) {
    try {
      const b = []
      const { publicKey, encoder, data, seal, context } = arguments
      const regenratedPublicKey = seal.PublicKey()
      regenratedPublicKey.load(context, publicKey)
      const encryptor = seal.Encryptor(context, regenratedPublicKey)
      const test = JSON.stringify(data)
      for (let i = 0; i < test.length; i++) {
        b.push(test.charCodeAt(i))
      }
      const plainText = encoder.encode(new Int32Array(b))
      const encryptedData = encryptor.encrypt(plainText)
      return encryptedData.save()
    } catch (e) {
      console.log(e)
    }
  },
  async decryptData(arguments) {
    try {
      const { privateKey, encoder, data, seal, context } = arguments
      const regenratedSecretKey = seal.SecretKey()
      regenratedSecretKey.load(context, privateKey)
      const decryptor = seal.Decryptor(context, regenratedSecretKey)
      const regeneratedCipherText = seal.CipherText()
      regeneratedCipherText.load(context, data)
      const decryptedData = decryptor.decrypt(regeneratedCipherText)
      const plainText = encoder.decode(decryptedData)
      return plainText.filter((node) => node !== 0)
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
