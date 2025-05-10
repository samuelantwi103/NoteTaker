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


const resetPassword = async (req, res) => {
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

const updateUser = async (req, res) => {
  var { id, firstName, lastName, otherNames, username, email, password } = req.body

  if (!id) {
    return res.status(406).json({
      success: false,
      message: "Please specify an ID"
    })
  }

  // Verify user identity or superadmin access
  if (id !== req.userData.id || req.userData.role === "superadmin")
    return res.status(403).json({
      success: false,
      message: "You don't have access to modify this user"
    })

  const userData = db.findUserById(id)
  if (!userData) {
    return res.status(404).json(
      {
        success: false,
        message: "User not found",
      }
    )
  }

  // Null Safety
  if (!firstName) {
    firstName = userData.firstName
  }
  if (!lastName) {
    lastName = userData.lastName
  }
  if (!otherNames) {
    otherNames = userData.otherNames
  }
  if (!username) {
    username = userData.username
  } else {
    const userFound = db.findUser(username, null)
    // console.log("FOUND U",userFound)
    if (userFound) {
      return res.status(403).json({
        success: false,
        message: "Username already exists"
      })
    }
  }

  if (!email) {
    email = userData.email
  } else {
    const userFound = db.findUser(null, email)
    // console.log("FOUND E",userFound)
    if (userFound) {
      return res.status(403).json({
        success: false,
        message: "Email associated with different account"
      })
    }

  }
  if (!password) {
    password = userData.password
  } else {
    // Hash new password
    try {
      const hpassword = await bcrypt.hash(password.toString(), await bcrypt.genSalt(10))
      password = hpassword

    } catch (e) {
      console.log(e)
      return res.status(406).json({
        success: false,
        message: `An error occurred: ${e.toString()}`
      })
    }
  }

  // Create User Object
  const user = new User(userData.id, firstName, lastName, otherNames, userData.role, username, email, password, userData.dateCreated, new Date(), userData.notes, userData.token)

  // Update User
  const isUpdated = db.updateUser(user)
  if (!isUpdated) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    })
  }
  res.status(200).json({
    success: true,
    message: "User data updated successfully"
  })
  // console.log(user.getInfo())

}

module.exports = { loginUser, registerUser, resetPassword, updateUser }