const User = require('../model/User')
const bcrypt = require('bcrypt')

exports.registerUser = async (req, res, next) => {
  let salt = bcrypt.genSaltSync(10)
  let hashPassword = bcrypt.hashSync(req.body.password, salt)
  try {
    const user = new User({ ...req.body, password: hashPassword })
    await user.save()
    res.send(JSON.stringify({ message: 'User added successful' }))
  } catch (err) {
    res.send(JSON.stringify({ message: 'User exists' }))
  }
}

exports.loginUser = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  try {
    const user = await User.findOne({ email })
    const hashPassword = user.password
    const match_password = bcrypt.compareSync(password, hashPassword)
    if (match_password) {
      res.send(JSON.stringify({ message: 'User login successful', user }))
    } else {
      res.send(JSON.stringify({ message: 'Wrong password' }))
    }
  } catch (err) {
    next(err)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email })
    const userId = user._id
    const bodyData = req.body
    await User.updateOne({ _id: userId }, bodyData)
    res.send(JSON.stringify({ message: 'User data updated' }))
  } catch (err) {
    next({ ...err, message: 'User not found' })
  }
}

exports.deleteUser = async (req, res, next) => {
  const email = req.body.email
  try {
    await User.findOneAndDelete({ email })
    res.send(JSON.stringify({ message: 'User data deleted successfull' }))
  } catch (err) {
    next({ ...err, message: 'User not found' })
  }
}

exports.getAllUserData = async (req, res) => {
  const users = await User.find({})
  res.send(users)
}
