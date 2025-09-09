require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./src/routes/route.js')
const paginate = require('express-paginate')
const bodyParser = require('body-parser')
const port = process.env.APP_PORT
const hostName = process.env.HOST_NAME
const fs = require('fs')
const { connectDB } = require('./src/config/connectDB')
const fileSystem = require('./src/config/fileSystem')
const cookieParser = require('cookie-parser')
const errorHandler = require('./src/middlewares/ErrorHandler.js')

const corsOptions = {
  origin: true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200
}

app.use(paginate.middleware(9999, 9999))
app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
fileSystem(app)

connectDB()

app.get('/', (req, res) => {
  res.send('Hello, Express!')
})

app.use('/api', router)

app.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
  let https = require('https')

  let httpsOptions = {
    key: fs.readFileSync(process.env.PATH_FILE_PRIVATE_KEY, 'utf-8'),
    cert: fs.readFileSync(process.env.PATH_FILE_CERTIFICATE, 'utf-8')
  }

  https.createServer(httpsOptions, app).listen(port, hostName, () => {
    console.log('Backend Nodejs is running on the: https://' + hostName + ':' + port)
  })
} else {
  let http = require('http')
  http.createServer(app).listen(port, hostName, () => {
    console.log('Backend Nodejs is running on the: http://' + hostName + ':' + port)
  })
}
