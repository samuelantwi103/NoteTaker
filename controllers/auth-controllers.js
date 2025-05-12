const { db } = require("../database/db")
const User = require("../models/user")
const bcrypt = require('bcryptjs')


const loginUser = async (req, res) => {
  const { username, email, password } = req.body
  var isLoggedIn
  try {
    // const user = User.createSession(username, password)

    isLoggedIn = await db.loginUser(username, email, password)
    // console.log(isLoggedIn)

    if (!isLoggedIn) {
      if (isLoggedIn == undefined) {
        res.status(406).json({
          success: false,
          message: "Wrong credentials",
        })
        return
      }
      res.status(404).json({
        success: false,
        message: "User not found",
      })
      return
    }
    // console.log("is not logged in")

  } catch (e) {
    console.log(e)
    res.status(404).json({
      success: false,
      message: `An error occurred: ${e.toString()}`
    })
    return
  }
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token: isLoggedIn.token
  })
}

const registerUser = async (req, res) => {
  const { firstName, lastName, otherNames, username, email, password, role, otp } = req.body

  try {
    const hpassword = await bcrypt.hash(password, await bcrypt.genSalt(10))

    const user = new User(null, firstName, lastName, otherNames, role, username, email, hpassword, null, null, null, null)
    const isCreated = db.createUser(user)

    if (isCreated.success === false) {
      res.status(406).json({
        success: false,
        message: isCreated.message,
      })
      return
    }
    // console.log(user.getInfo())

  } catch (e) {
    res.status(406).json({
      success: false,
      message: `An error occurred: ${e.toString()}`
    })
    return
  }
  db.createOTP(username, email, otp)
  res.status(200).json({
    success: true,
    message: "User registered successfully"
  })
}


const forgotPassword = async (req, res) => {
  const { username, email, password } = req.body

  if (!password) {
    return res.status(406).json({
      success: false,
      message: "Please provide the new password!"
    })
  }

  const userData = db.findUser(username, email)
  if (!userData) {
    return res.status(404).json(
      {
        success: false,
        message: "User not found",
      }
    )
  }

  try {
    const hpassword = await bcrypt.hash(password.toString(), await bcrypt.genSalt(10))

    const user = new User(userData.id, userData.firstName, userData.lastName, userData.otherNames, userData.role, userData.username, userData.email, hpassword, userData.dateCreated, new Date(), userData.notes, userData.token)
    const isUpdated = db.updateUser(user)

    if (!isUpdated) {
      res.status(404).json({
        success: false,
        message: "User does not exist",
      })
      return
    }
    // console.log(user.getInfo())

  } catch (e) {
    console.log(e)
    res.status(406).json({
      success: false,
      message: `An error occurred: ${e.toString()}`
    })
    return
  }
  res.status(200).json({
    success: true,
    message: "Password reset successfully"
  })
}



module.exports = { loginUser, registerUser, forgotPassword }