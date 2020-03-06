const bodyParser = require('body-parser')
const compression = require('compression')
const expressStatusMonitor = require('express-status-monitor')
const morgan = ('morgan')
// const logger = require('./helpers/logger')
// const pathMiddleware = './modules/core/middlewares/path.middleware'

module.exports = (app) => {
  app.use(expressStatusMonitor())
  app.use(compression())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
}


