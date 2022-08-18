const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

const app = express()
const userRoute = require('./routes/userRoute.js')
const adsRouter = require('./routes/advertisementRoute.js')

dotenv.config()
const PORT = 5001

let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/user', userRoute)
app.use('/api/ads', adsRouter)
app.use('/public', express.static(__dirname + '/public'))

// Error handling
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong from the server side'
  return res.status(status).json({
    message,
  })
})

// MongoDB
const connectToDb = () => {
  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log('Connected to db')
    })
    .catch((err) => console.log('error occured'))
}

// app initialization
app.listen(process.env.PORT || PORT, () => {
  connectToDb()
  console.log(`server started on port ${PORT}`)
})
