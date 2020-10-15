// const logger = require('./helpers/logger')
// const pathMiddleware = './modules/core/middlewares/path.middleware'
const bookRouter = require("./modules/book/book.router");
const TestController = require("./modules/tes/tes.controller");
const WhatsAppController = require("./modules/whatsapp.js/whatsapp.controller");

module.exports = (app) => {
  app.use("/book", bookRouter);
  app.use("/whatsapp", WhatsAppController);
  app.use("/tes", TestController);
};
