const fs = require('node:fs')
const database = require('./db.json')
const Database = require('../models/database')
const User = require('../models/user')

var db = Database.createSession(database)
// console.log("working")


// function createUser(firstName, lastName, otherNames, username, password) {

// }





module.exports = { db }