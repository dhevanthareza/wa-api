// const logger = require('./helpers/logger')
// const pathMiddleware = './modules/core/middlewares/path.middleware'
const bookRouter = require("./modules/book/book.router");
const ppdRouter = require("./modules/ppd/ppd.controller");

module.exports = (app) => {
  app.use("/book", bookRouter);
  app.use("/ppd", ppdRouter);
};
