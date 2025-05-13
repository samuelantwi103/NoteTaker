const fs = require("node:fs")
const User = require("./user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


class Database {
  constructor(title, version, databaseData) {
    this.title = title
    if (databaseData.dateCreated === "") {
      this.dateCreated = new Date()
    } else {
      this.dateCreated = databaseData.dateCreated
    }
    this.dateUpdated = new Date()
    this.version = version
    this.data = databaseData.data
    // this.databaseData = databaseData

    // const data = {}

    // fs.readFile('./database/db.json', (err, content) => {
    //   if (err) {
    //     console.log("Something went wrong")
    //     return
    //   }
    //   data = content
    // })

    databaseData = {
      ...databaseData, ...{
        title: this.title,
        dateCreated: this.dateCreated,
        dateUpdated: this.dateUpdated,
        version: this.version,
      }
    }
    // this.data = databaseData

    this.save()
    console.log("DB Connected successfully");
    // console.log(this.data)

    // save(databaseData)
  }

  // Set database version
  setVersion(version) {
    this.version = version
  }

  // Create database session
  static createSession(data) {
    return new Database(data.title, data.version, data)

  }

  // get database info
  getInfo() {
    return {
      title: this.title,
      version: this.version,
      dateCreated: this.dateCreated,
      dateUpdated: this.dateUpdated,
      data: this.data,
    }
  }

  // Create a new user
  createUser(user) {
    const index = this.data.findIndex((userData =>
      userData.username === user.username
    ))
    const emailIndex = this.data.findIndex((userData =>
      userData.email === user.email
    ))
    if (index === -1 && emailIndex === -1) {

      // console.log(password)
      // console.log(index)
      this.data.push({ ...user.getInfo(), isActivated: false })
    } else if (index !== -1) {
      // console.log(index)
      console.log("Username already exists")
      this.save()
      return {
        success: false,
        message: "Username already exists",
      }
    } else if (emailIndex !== -1) {
      // console.log(index)
      console.log("Email already exists")
      this.save()
      return {
        success: false,
        message: "Email already exists",
      }
    }
    // console.log(this.data)
    this.save()
    return true
  }

  activateUser(username, email) {

    const userData = this.findUser(username, email)


    if (userData !== undefined) {
      if (!userData) {
        console.log("User not found")
        return false
      }

      if (userData.isActivated === undefined) {
        console.log('Account already activated!')

        return {
          success: false,
          message: 'Account has been activated already!'
        }
      }



    } else {
      // console.log(userInfo)
      console.log("User does not exist")
      this.save()
      return false
    }


    // Clearing activation boolean
    const index = this.findUserIndex(username, email)


    if (index === -1) {
      console.log("User not found")
      return false
    }
    // Update date
    userData.dateUpdated = new Date()

    username = userData.username
    email = userData.email

    delete userData.isActivated
    this.data[index] = userData
    console.log(userData)
    this.clearOTP(username, email)
    this.save()
    return true

  }

  // Login a user
  async loginUser(username, email, password) {
    let token
    const userInfo = this.findUser(username, email)
    // console.log(userInfo)

    if (userInfo !== undefined) {
      if (!userInfo) {
        console.log("User not found")
        return false
      }
      const isValidPassword = await bcrypt.compare(password, userInfo.password)
      // console.log(userInfo)
      if (!isValidPassword) {
        console.log("Wrong password")
        this.save()
        return
      }

      // Generate Token
      token = jwt.sign({
        id: userInfo.id,
        username: userInfo.username,
        role: userInfo.role
      }, process.env.JWT_SECRET_KEY, {
        expiresIn: "10m"
      })

      // Store Token
      var index
      userInfo.token = token
      userInfo.dateUpdated = new Date()
      if (username != null) {
        index = this.data.findIndex((userData =>
          userData.username === username
        ))
        this.data[index] = userInfo
      } else if (email != null) {
        index = this.data.find((userData =>
          userData.email === email
        ))
        this.data[index] = userInfo
      }
      // console.log(this.data)

      // Create Session
      await User.createSession(username, email, password, userInfo)

      // this.data.push(user.getInfo())
    } else {
      // console.log(userInfo)
      console.log("User does not exist")
      this.save()
      return false
    }

    // console.log(this.data)
    this.save()
    return { status: true, token }
  }

  // Find a user
  findUser(username, email) {
    if (username != null || email != null) {
      var userInfo

      if (username != null) {
        userInfo = this.data.find((userData =>
          userData.username === username
        ))

      }
      if (email != null) {
        userInfo = this.data.find((userData =>
          userData.email === email
        ))

        // console.log(userInfo)
      }

    }
    else {
      console.log("Please provide an email or username")
      return false
    }
    console.log(userInfo)
    return userInfo
  }

  // Get user index
  findUserIndex(username, email) {
    if (username != null || email != null) {
      var userId
      if (username != null) {
        userId = this.data.findIndex((userData =>
          userData.username === username
        ))

      } if (email != null) {
        userId = this.data.findIndex((userData =>
          userData.email === email
        ))

        // console.log(userInfo)
      }
    }
    else {
      console.log("Please provide an email or username")
      return false
    }
    return userId
  }

  findUserById(id) {
    var userInfo
    if (id != null) {
      userInfo = this.data.find((userData =>
        userData.id === id
      ))
    }
    else {
      console.log("Please provide an id")
      return false
    }
    return userInfo
  }

  updateUser(user) {
    const index = this.data.findIndex((userData =>
      userData.id === user.id
    ))

    if (index === -1) {
      console.log("User not found")
      return false
    }

    this.data[index] = user.getInfo()
    this.save()
    return true
  }

  removeUser(user) {

    const index = this.data.findIndex((userData =>
      userData.username === user.username
    ))

    if (index === -1) {
      console.log("User not found")
      return false
    }

    this.data.splice(index, 1)
    this.save()
    return true
  }

  save() {
    fs.writeFileSync('./database/db.json', JSON.stringify({
      title: this.title,
      version: this.version,
      dateCreated: this.dateCreated,
      dateUpdated: new Date(),
      data: this.data,
    }, null, 2), (err) => {
      if (err) {
        console.log("Something went wrong")
        return
      }
      return
    })
  }

  createOTP(username, email, otp) {
    const index = this.findUserIndex(username, email)
    const userData = this.findUser(username, email)


    if (index === -1) {
      console.log("User not found")
      return false
    }
    // console.log(otp)
    var newOTP = otp
    if (otp === null) {
      newOTP = Math.floor(100000 + Math.random() * 900000)
    }
    userData.dateUpdated = new Date()
    userData.otp = newOTP

    this.data[index] = userData
    // console.log(`OTP Generated: ${newOTP}`)
    this.save()
    // console.log(newOTP)
    return newOTP

  }

  verifyOTP(username, email, otp) {
    const userData = this.findUser(username, email)


    if (userData !== undefined) {
      if (!userData) {
        console.log("User not found")
        return false
      }

      if (!userData.otp) {
        console.log('No existing OTP Request found!')

        return {
          success: false,
          message: 'No existing OTP Request found!'
        }
      }

    } else {
      // console.log(userInfo)
      console.log("User does not exist")
      this.save()
      return false
    }
    if (userData.otp.toString() !== otp.toString()) {
      return {
        success: false,
        message: 'Invalid OTP'
      }
    }

    this.save()
    return true
  }

  clearOTP(username, email) {
    const index = this.findUserIndex(username, email)
    const userData = this.findUser(username, email)


    if (index === -1) {
      console.log("User not found")
      return false
    }
    // Update date
    userData.dateUpdated = new Date()

    username = userData.username
    email = userData.email
    delete userData.otp
    this.data[index] = userData
    this.save()
    return true
  }

}

module.exports = Database