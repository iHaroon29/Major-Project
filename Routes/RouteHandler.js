const encryptionController = require('../Controller/encryptionController')
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
])

Router.route('/decrypt').post([
  encryptionController.isAuthenticated,
  encryptionController.dataDecryption,
])

module.exports = Router
