const chalk = require("chalk");
const dotenv = require("dotenv");
const express = require("express");
const moment = require("moment");
const path = require("path");
const controllerLoader = require("./controller.loader");
const middlewareLoader = require("./middleware.loader");
const { Client } = require("whatsapp-web.js");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

dotenv.config();
moment.locale("id");

class App {
  app;

  constructor() {
    this.app = express();
    this.settings();
    middlewareLoader(this.app);
  }

  async listen() {
    // const whatsapp = await wa.create({
    //   qrFormat: 'webm',
    //   // useChrome: true,
    //   ignoreDefaultArgs: ['--disable-extensions'],
    //   args: [
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox',
    //   ],
    // })
    // whatsapp.onStateChanged((state)=>{
    //   console.log('statechanged', state)
    //   if(state==="CONFLICT" || state==="UNLAUNCHED") whatsapp.forceRefocus();

    //   if(state==='UNPAIRED') whatsapp.forceRefocus()
    // });
    console.log("===================GETTING READY======================");
    const SESSION_FILE_PATH = "./session.json";
    let sessionData;
    if (fs.existsSync(SESSION_FILE_PATH)) {
      sessionData = require(SESSION_FILE_PATH);
    }
    const client = new Client({
      puppeteer: {args: ["--no-sandbox", "--disable-setuid-sandbox"]},
      session: sessionData,
    });
    client.on("qr", (qr) => {
      console.log("QR RECEIVED", qr);
      qrcode.generate(qr, { small: true });
    });
    client.on("authenticated", (session) => {
      console.log(
        "===============AUTHENTICATED================================="
      );
      sessionData = session;
      fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
          console.error(err);
        }
      });
    });
    client.on("change_state", (state) => {
      console.log(state);
      if (state === "UNPAIRED" || state === "CONFLICT") {
        console.log("UNPAIRED")``;
        client.initialize();
      }
    });
    client.on("ready", () => {
      console.log("===================WA READY==========================");
    });
    client.initialize();
    this.app.use((req, res, next) => {
      req.whatsapp = client;
      next();
    });
    controllerLoader(this.app);
    this.app.listen(this.app.get("port"), () => {
      console.log(
        `${chalk.green("✓")} server started at http://localhost:${this.app.get(
          "port"
        )}`
      );
    });
  }

  settings() {
    this.app.set("host", "0.0.0.0");
    this.app.set("port", process.env.PORT || 3002);
    // this.app.set('views', path.join(__dirname, '../views'))
    // this.app.set('view engine', 'pug')
    // this.app.use('/assets', express.static('views/assets'))
  }
}
const server = new App();
server.listen();
