
// const logger = require('./helpers/logger')
// const pathMiddleware = './modules/core/middlewares/path.middleware'
const bookRouter = require('./modules/book/book.router')
module.exports = (app) => {
  app.use('/book', bookRouter)
}


