const encryptionController = require('../Controller/encryptionController')
const Router = require('express').Router()

Router.route('/signup').post(encryptionController.userRegistration)
Router.route('/login').post(encryptionController.userAuthorization)

Router.route('/generateKeys').get([
  encryptionController.isAuthenticated,
  encryptionController.generateKeys,
])
// Router.route('/:userId').get(encryptionController.dataEncryption)

module.exports = Router
