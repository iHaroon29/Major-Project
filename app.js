const app = require('express')()
const routeHandler = require('./Routes/RouteHandler')

app.use(require('cors')())
app.use(require('helmet')())
app.use(require('express').json())
app.use(require('express').urlencoded({ extended: true }))

app.use(routeHandler)

module.exports = app
