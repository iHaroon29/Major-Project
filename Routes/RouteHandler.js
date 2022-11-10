const encryptionController = require('../controller/encryptionController')
const compressionUtils = require('../Utils/compression.utils')
const Router = require('express').Router()

Router.route('/signup').post(encryptionController.userRegistration)
Router.route('/login').post(encryptionController.userAuthorization)

Router.route('/generateKeys').get([
  encryptionController.isAuthenticated,
  encryptionController.generateKeys,
])

Router.route('/encrypt').post([
  encryptionController.isAuthenticated,
  encryptionController.dataEncryption,
  // compressionUtils.compress,
])

Router.route('/decrypt').post([
  encryptionController.isAuthenticated,
  encryptionController.dataDecryption,
])

Router.route('/test').get((req, res, next) => {
  compressionUtils.compress(req, res, next)
  // res.status(200).send({ message: 'Hello New Route' })
})

module.exports = Router
