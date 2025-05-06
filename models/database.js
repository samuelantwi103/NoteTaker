const fs = require("node:fs")
const User = require("./user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// const data = []
// data.

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

  setVersion(version) {
    this.version = version
  }

  static createSession(data) {
    return new Database(data.title, data.version, data)

  }

  getInfo() {
    return {
      title: this.title,
      version: this.version,
      dateCreated: this.dateCreated,
      dateUpdated: this.dateUpdated,
      data: this.data,
    }
  }

  async createUser(user) {
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

  async loginUser(username, email, password) {
    let token
    const userInfo = this.findUser(username, email)
    console.log(userInfo)

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

}

module.exports = Database