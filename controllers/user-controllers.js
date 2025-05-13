const { db } = require("../database/db")
const User = require("../models/user")
const bcrypt = require('bcryptjs')

const updateUser = async (req, res) => {
  var { id, firstName, lastName, otherNames, username, email, password } = req.body

  if (!id) {
    return res.status(406).json({
      success: false,
      message: "Please specify an ID"
    })
  }

  // Verify user identity or superadmin access
  if (id !== req.userData.id && req.userData.role !== "superadmin")
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
  const user = new User(userData.id, firstName, lastName, otherNames, userData.role, username, email, password, userData.dateCreated, new Date(), userData.notes, userData.token, userData.isActivated)

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

const resetPassword = async (req, res) => {
  const { password, old_password } = req.body


  if (!password) {
    return res.status(406).json({
      success: false,
      message: "Please provide a new password!"
    })
  }

  if (!old_password) {
    return res.status(406).json({
      success: false,
      message: "Please provide the current password!"
    })
  }

  try {
    const userData = db.findUser(req.userData.username, null);

    // Verify Password
    const isValidPassword = await bcrypt.compare(old_password.toString(), userData.password)
    // console.log(userInfo)
    if (!isValidPassword) {
      return res.status(403).json({
        success: false,
        message: "Incorrect existing password provided!"
      })
    }

    const hpassword = await bcrypt.hash(password.toString(), await bcrypt.genSalt(10))

    const user = new User(userData.id, userData.firstName, userData.lastName, userData.otherNames, userData.role, userData.username, userData.email, hpassword, userData.dateCreated, new Date(), userData.notes, userData.token, userData.isActivated)
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


const setRole = async (req, res) => {
  var { id, firstName, lastName, otherNames, username, email, password } = req.body

  if (!id) {
    return res.status(406).json({
      success: false,
      message: "Please specify an ID"
    })
  }

  // Verify user identity or superadmin access
  if (id !== req.userData.id && req.userData.role !== "superadmin")
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
  const user = new User(userData.id, firstName, lastName, otherNames, userData.role, username, email, password, userData.dateCreated, new Date(), userData.notes, userData.token, userData.isActivated)

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

module.exports = { updateUser, resetPassword, setRole }