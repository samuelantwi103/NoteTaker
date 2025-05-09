const fs = require('node:fs')
const { db } = require('../database/db')

const backupDatabse = (req, res) => {
  const dbPath = './database/db.json'
  db.save()

  return res.download(dbPath, (err) => {
    if (err) {
      console.log(err)
      return
      // res.status(200).json({
      //   status: false,
      //   message: 'Error downloading database',
      //   error: err
      // }      )
    }

    // return res.download


  })
}

const backupUserData = (req, res) => {
  db.save()
  let userData = db.findUser(req.userData.username, null)
  delete userData.otp
  // console.log(userData)

  res.status(200).json({
    status: true,
    message: 'User data successfully backed up',
    data: userData
  })

}

module.exports = { backupDatabse, backupUserData }