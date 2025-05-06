// const database = require('../database/db.json')


const uuid = require('uuid')

class User {
  constructor(id, firstName, lastName, otherNames, role = "user", username, email, password, dateCreated, dateUpdated, notes, token) {
    if (id == null) {
      this.id = id
    } else {
      this.id = uuid.v4()
    }
    this.firstName = firstName
    this.lastName = lastName
    this.otherNames = otherNames
    this.role = role
    this.username = username
    // if (email === null) {
    //   this.email = email
    // } else {
    this.email = email
    // }
    this.password = password
    if (dateCreated === null) {
      this.dateCreated = new Date()
    } else {
      this.dateCreated = dateCreated
    }
    if (dateUpdated === null) {
      this.dateUpdated = new Date()
    } else {
      this.dateUpdated = dateUpdated
    }
    if (notes === null) {
      this.notes = []
    } else {
      this.notes = notes
    }
    if (token === null) {
      this.token = ""
    } else {
      this.token = token
    }

  }

  static async createSession(username, email, password, userInfo) {
    // const hpassword = await bcrypt.hash(password, await bcrypt.genSalt(10))



    return new User(userInfo.id, userInfo.firstName, userInfo.lastName, userInfo.otherNames, userInfo.role, username, email, password, userInfo.dateCreated, userInfo.dateUpdated, userInfo.notes, userInfo.token)
  }

  getInfo() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      otherNames: this.otherNames,
      role: this.role,
      password: this.password,
      otherNames: this.otherNames,
      dateCreated: this.dateCreated,
      dateUpdated: this.dateUpdated,
      token: this.token,
      notes: this.notes
    }
  }

  getToken() {
    return this.token
  }

  getNotes() {
    return this.notes
  }
  getRole() {
    return this.role
  }

  setUsername(username) {
    this.username = username
  }

  setName(firstName, lastName, otherNames) {
    if (firstName !== null) {
      this.firstName = firstName
    }
    if (lastName !== null) {
      this.lastName = lastName
    }
    if (otherNames !== null) {
      this.otherNames = otherNames
    }
  }

}

module.exports = User