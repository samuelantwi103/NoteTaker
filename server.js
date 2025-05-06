require('dotenv').config()
const path = require('node:path')
const fs = require('node:fs')
const express = require('express')
const authRoute = require('./routes/auth-routes')
const homeRoute = require('./routes/home-routes')
const backupRoute = require('./routes/backup-routes')

const { db } = require('./database/db')
// const db = require('./database/db.json')

db
// initDB()
// save({})

const app = express()
const PORT = process.env.PORT || 3000

// console.log(db.getInfo())

// Middlewares
app.use(express.json())

// Routes
app.use('/auth', authRoute)
app.use('/home', homeRoute)
app.use('/backup', backupRoute)


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
  console.log(`http://localhost:${PORT}`)
})

// var databaseData = {
//   name: "sam"
// }

// const data = {
//   name: "Rol"
// }
// databaseData = { ...databaseData, ...data }
// console.log(databaseData)

// setTimeout(() => {

//   db.total = 3
//   fs.writeFile('./database/db.json', JSON.stringify(db, null, 2), (err) => {
//     if (err)
//       console.log(err)
//   })
// }, 3000)

// // console.log("something is working")
// console.log(db.total)


