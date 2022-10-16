const paillier = require('paillier-bigint')
const keyModel = require('../Database/keyModel')
const userModel = require('../Database/userModel')

const {
  dataHashing,
  encryptData,
  decryptData,
  dataVerifying,
  jwtGeneration,
  jwtVerification,
  jwtDecoding,
  testEncrypt,
  keyToObjectConverter,
} = require('../Utils/encryption.utils')

module.exports = {
  async userRegistration(req, res, next) {
    try {
      const { username, password } = req.body
      const existingUser = await userModel.findUsers({ username })
      if (existingUser)
        return res
          .status(400)
          .json({ message: `${username} already exists!!`, auth: false })
      const hashedPassword = await dataHashing(password)
      const token = await jwtGeneration(username)
      const newUser = await userModel.saveUsers({
        username,
        password: hashedPassword,
      })
      res.status(200).json({ newUser, token, auth: true })
    } catch (e) {
      console.log(e)
      res.status(500).send(e)
    }
  },
  async userAuthorization(req, res, next) {
    try {
      const { username, password } = req.body
      const user = await userModel.findUsers({ username })
      if (!user)
        return res
          .status(400)
          .json({ message: `${username} doesn't exists!!`, auth: false })
      const passwordVerification = await dataVerifying({
        normalData: password,
        hashedData: user.password,
      })
      if (!passwordVerification)
        return res
          .status(400)
          .json({ message: 'Invalid Credentials!!!', auth: false })
      const token = await jwtGeneration(username)
      res.status(200).json({ user, token, auth: true })
    } catch (e) {
      res.status(500).send(e)
    }
  },
  async isAuthenticated(req, res, next) {
    try {
      const { authorization } = req.headers
      if (!authorization)
        return res.status(400).json({ message: 'Token missing!', auth: false })
      if (!/Bearer /.test(authorization))
        return res
          .status(400)
          .json({ message: 'Invalid Token Format', auth: false })
      const token = authorization.split(' ')[1].trim()
      const tokenVerification = await jwtVerification(token)
      if (!tokenVerification)
        return res
          .status(400)
          .json({ message: 'Invalid / Expired Token', auth: false })

      next()
    } catch (e) {
      console.log(e)
      res.status(500).send({ e, auth: false })
    }
  },
  async generateKeys(req, res, next) {
    try {
      const { authorization } = req.headers
      const decodedTokenData = await jwtDecoding(authorization.split(' ')[1])
      const { publicKey, privateKey } = await paillier.generateRandomKeys(3076)
      const keyObjectPublic = await keyToObjectConverter(publicKey)
      const keyObjectPrivate = await keyToObjectConverter(privateKey)
      const encyrptedPrivateKey = await testEncrypt(keyObjectPrivate)
      const hashedPublicKey = await dataHashing(JSON.stringify(keyObjectPublic))
      const newKey = await keyModel.saveNewKey({
        uniqueId: decodedTokenData,
        publicKey: keyObjectPublic,
        privateKey: encyrptedPrivateKey,
      })
      const updatedUser = await userModel.updateUsers({
        username: decodedTokenData,
        keysGenerated: true,
      })
      res.status(200).send({ hashedPublicKey })
    } catch (e) {
      console.log(e)
      res.status(400).send(e)
    }
  },
  async dataEncryption(req, res, next) {
    try {
      const decodedData = await jwtDecoding(
        req.headers.authorization.split(' ')[1]
      )
      const { API_KEY } = req.query
      const { data } = req.body
      const existingKey = await keyModel.findKeys({ decodedData })
      const dataVerification = await dataVerifying({
        normalData: JSON.stringify(existingKey.publicKey),
        hashedData: API_KEY,
      })
      if (!dataVerification)
        res.status(400).send({ message: 'API_KEY invalid!!' })
      const encryptedData = await encryptData({
        data,
        publicKey: existingKey.publicKey,
      })
      res.send(encryptedData)
    } catch (e) {
      res.status(400).send(e)
    }
  },
  async dataDecryption(req, res, next) {
    try {
      const { encryptData } = req.body
      const decryptedData = await decryptData(encryptData)
      res.send(decryptedData)
    } catch (e) {
      res.status(400).send(e)
    }
  },
}
