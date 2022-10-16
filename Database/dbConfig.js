require('dotenv').config()
const connection = require('mongoose').createConnection(process.env.DB_URL)

connection.on('connected', () => {
  console.log('Connection Established with DB!')
})

connection.on('error', (e) => {
  console.log('MongoDB Connection failed with' + ' ' + e)
})

module.exports = connection
