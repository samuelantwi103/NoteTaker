const { db } = require("../database/db")

const createOTP = (req, res) => {
  const { username, email } = req.body

  const otp = db.createOTP(username, email)
  if (!otp) {
    return res.status(404).json({
      success: false,
      message: "User not found!"
    })
  }

  return res.status(200).json({
    success: true,
    message: "OTP generated successfully!",
    otp
  })
}

const verifyOTP = (req, res) => {
  const { otp, username, email } = req.body

  const userData = db.findUser(username, email)


}



module.exports = { createOTP, verifyOTP }