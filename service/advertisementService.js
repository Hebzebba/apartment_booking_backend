const multer = require('multer')
const fs = require('fs')
const { uuid } = require('uuidv4')
const User = require('../model/User')
const Advertisement = require('../model/Advertisement')

const DIR = './public/'
if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR)
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR)
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-')
    cb(null, uuid() + '-' + fileName)
  },
})

let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
    }
  },
})

exports.imageUpload = upload.array('file', 6)

exports.postAds = async (req, res, next) => {
  try {
    const { email, category, longitude, latitude, price, location, number_of_rooms, number_of_bath_rooms, distance, description } = req.body
    const reqFiles = []
    const url = req.protocol + '://' + req.get('host')

    if (req.files.length > 0) {
      req.files.map((file) => {
        reqFiles.push(`${url}/${file.path}`)
      })
    }

    const user = await User.findOne({ email })
    const { name, contact } = user
    const ads = new Advertisement({
      user: { email, name, contact },
      category,
      room_info: {
        price,
        location,
        number_of_rooms,
        number_of_bath_rooms,
        distance,
        description,
      },
      images: reqFiles,
      coordinate: { longitude, latitude },
    })
    await ads.save()
    res.send(JSON.stringify({ message: 'Ads posted successful' }))
  } catch (error) {
    next(error)
  }
}

exports.deleteAds = async (req, res, next) => {
  try {
    const id = req.query.id
    await Advertisement.findByIdAndDelete({ _id: id })
    res.send(JSON.stringify({ message: 'Ads deleted' }))
  } catch (error) {
    next({ ...error, message: 'Ads not found' })
  }
}

exports.getAllAds = async (req, res) => {
  const users = await Advertisement.find({})
  res.send(users)
}
