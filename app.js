const app = require('express')()
const routeHandler = require('./Routes/RouteHandler')

app.use(require('cors')())
app.use(require('helmet')())
app.use(require('compression')(require('zlib').constants.Z_BEST_COMPRESSION))
app.use(require('express').json({ limit: '50mb' }))
app.use(require('express').urlencoded({ extended: true, limit: '50mb' }))

app.use(routeHandler)

module.exports = app
