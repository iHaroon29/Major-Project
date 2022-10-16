require('dotenv').config()
const connection = require('mongoose').createConnection(process.env.DB_URL)

module.exports = connection
