const keyModel = require('../Database/keyModel')
const { sealInitialize } = require('../seal_config/seal_config')

;(async () => {
  const { seal, encoder, keyGenerator, context } = await sealInitialize()
  global.SEAL ??= { seal, encoder, keyGenerator, context }
})()

const userModel = require('../Database/userModel')
const fs = require('fs')
const {
  dataHashing,
  decryptData,
  dataVerifying,
  jwtGeneration,
  jwtVerification,
  jwtDecoding,
  encryptData,
  testEncrypt,
  keyToObjectConverter,
  testDecrypt,
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
      const newUser = await userModel.saveUsers({
        username,
        password: hashedPassword,
      })
      const token = await jwtGeneration(newUser._id)
      res.status(200).json({ newUser, token, auth: true })
    } catch (e) {
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
      const token = await jwtGeneration(user._id)
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
      const filename = `PublicKey_${decodedTokenData}.txt`
      const keyWriteStream = fs.createWriteStream(filename)
      const existingUser = await userModel.findUsers({
        userId: decodedTokenData,
      })
      if (existingUser.keyGenerated && existingUser)
        return res.status(400).send({
          message:
            'Keys Already Generated. Revoke previous keys to generate new!',
        })

      const publicKey = global.SEAL.keyGenerator.createPublicKey()
      const secretKey = global.SEAL.keyGenerator.secretKey()

      const publicKeyCopy = publicKey.save()
      const privateKeyCopy = secretKey.save()

      keyWriteStream.write(publicKeyCopy)

      const newKeys = await keyModel.saveNewKeys({
        user_id: decodedTokenData,
        publicKey: publicKeyCopy,
        privateKey: privateKeyCopy,
      })
      const updatedUser = await userModel.updateUsers({
        user_id: decodedTokenData,
        keysGenerated: true,
      })

      const API_KEY = await dataHashing(publicKeyCopy)

      res.status(200).send({ API_KEY })
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
      const existingKey = await keyModel.findKeys({ user_id: decodedData })
      const dataVerification = await dataVerifying({
        normalData: existingKey.publicKey,
        hashedData: API_KEY,
      })
      if (!dataVerification)
        return res.status(400).send({ message: 'API_KEY invalid!!' })
      const encryptedData = await encryptData({
        encoder: global.SEAL.encoder,
        seal: global.SEAL.seal,
        publicKey: existingKey.publicKey,
        data: req.body,
        context: global.SEAL.context,
      })
      res.status(200).send({ encryptedData })
    } catch (e) {
      console.log(e)
      res.status(400).send(e.message)
    }
  },
  async dataDecryption(req, res, next) {
    try {
      let p = ''
      const decodedData = await jwtDecoding(
        req.headers.authorization.split(' ')[1]
      )

      const { API_KEY } = req.query
      const { encryptedData } = req.body
      const existingKey = await keyModel.findKeys({
        user_id: decodedData,
      })
      const dataVerification = await dataVerifying({
        normalData: existingKey.publicKey,
        hashedData: API_KEY,
      })
      if (!dataVerification)
        return res.status(400).send({ message: 'API_KEY invalid!!' })
      const decryptedData = await decryptData({
        encoder: global.SEAL.encoder,
        seal: global.SEAL.seal,
        privateKey: existingKey.privateKey,
        data: encryptedData,
        context: global.SEAL.context,
      })
      for (var i = 0; i < decryptedData.length; i++) {
        p += String.fromCharCode(decryptedData[i])
      }
      res.status(200).json(JSON.parse(p))
    } catch (e) {
      console.log(e)
      res.status(400).send(e)
    }
  },
}
