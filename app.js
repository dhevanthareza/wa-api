const chalk = require('chalk')
const dotenv = require('dotenv')
const express = require('express')
const moment = require('moment')
const path = require('path')
const controllerLoader = require('./controller.loader')
const middlewareLoader = require('./middleware.loader')
const wa = require('@open-wa/wa-automate');

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

dotenv.config()
moment.locale('id')

class App {
  app;

  constructor() {
    this.app = express()
    this.settings()
    // middlewareLoader(this.app)
  }

  async listen() {
    const whatsapp = await wa.create({
      qrFormat: 'webm',
      // useChrome: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    })
    whatsapp.onStateChanged((state)=>{
      console.log('statechanged', state)
      if(state==="CONFLICT" || state==="UNLAUNCHED") whatsapp.forceRefocus();
  
      if(state==='UNPAIRED') whatsapp.forceRefocus()
    });
    this.app.use((req,res,next) => {
      req.whatsapp = whatsapp
      req.tes = "sadsa"
      next()
    })
    controllerLoader(this.app)
    this.app.listen(this.app.get('port'), () => {
      console.log(`${chalk.green('✓')} server started at http://localhost:${this.app.get('port')}`)
    })
  }

  settings() {
    this.app.set('host', '0.0.0.0')
    this.app.set('port', process.env.PORT || 8080)
    // this.app.set('views', path.join(__dirname, '../views'))
    // this.app.set('view engine', 'pug')
    // this.app.use('/assets', express.static('views/assets'))
  }
}
const server = new App()
server.listen()
