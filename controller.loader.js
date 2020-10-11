// const logger = require('./helpers/logger')
// const pathMiddleware = './modules/core/middlewares/path.middleware'
const bookRouter = require("./modules/book/book.router");
const WhatsAppController = require("./modules/whatsapp.js/whatsapp.controller");

module.exports = (app) => {
  app.use("/book", bookRouter);
  app.use("/whatsapp", WhatsAppController);
};
