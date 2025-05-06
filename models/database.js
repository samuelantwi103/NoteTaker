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
    if (index === -1) {

      // console.log(password)
      // console.log(index)
      this.data.push(user.getInfo())
    } else {
      // console.log(index)
      console.log("username already exists")
      this.save()
      return false
    }
    // console.log(this.data)
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
    var userInfo

    if (username != null) {
      userInfo = this.data.find((userData =>
        userData.username === username
      ))

    } else if (email != null) {
      userInfo = this.data.find((userData =>
        userData.email === email
      ))

      // console.log(userInfo)
    }
    else {
      console.log("Please provide an email or username")
      return false
    }
    return userInfo
  }

  // Ge
  findUserId(username, email) {
    var userId
    if (username != null) {
      userId = this.data.findIndex((userData =>
        userData.username === username
      ))

    } else if (email != null) {
      userId = this.data.findIndex((userData =>
        userData.email === email
      ))

      // console.log(userInfo)
    }
    else {
      console.log("Please provide an email or username")
      return false
    }
    return userId
  }

  updateUser(user) {
    const index = this.data.findIndex((userData =>
      userData.username === user.username
    ))

    if (index === -1) {
      console.log("User not found")
      return false
    }

    this.data[index] = user.getInfo()
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

  createOTP(username, email) {
    const index = this.findUserId(username, email)
    const userData = this.findUser(username, email)


    if (index === -1) {
      console.log("User not found")
      return false
    }
    const otp = Math.floor(100000 + Math.random() * 900000)
    userData.dateUpdated = new Date()
    userData.otp = otp

    this.data[index] = userData
    console.log(`OTP Generated: ${otp}`)
    this.save()
    return otp
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
    if (userData.otp !== otp) {
      return {
        success: false,
        message: 'Invalid OTP'
      }
    }
    this.clearOTP(username, email)
    this.save()
    return true
  }

  clearOTP(username, email) {
    const index = this.findUserId(username, email)
    const userData = this.findUser(username, email)


    if (index === -1) {
      console.log("User not found")
      return false
    }
    // Update date
    userData.dateUpdated = new Date()

    const { id, firstName, lastName, otherNames, role, password, dateCreated, dateUpdated, notes, token } = userData

    username = userData.username
    email = userData.email

    this.data[index] = new User(id, firstName, lastName, otherNames, role, username, email, password, dateCreated, dateUpdated, notes, token).getInfo()
    this.save()
    return true
  }

}

module.exports = Database