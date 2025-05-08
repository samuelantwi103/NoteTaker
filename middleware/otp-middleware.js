const { db } = require("../database/db")


const confirmOTP = (req, res, next) => {
  try {
    const { username, email, otp } = req.body
    const isVerified = db.verifyOTP(username, email, otp)
    // console.log(isVerified)

    if (!isVerified) {
      return res.status(404).json({
        success: false,
        message: "User does not exist!"
      })
    }
    else if (isVerified.success == false) {
      return res.status(403).json({
        success: false,
        message: isVerified.message
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.toString()
    })
  }
  console.log('OTP Verified')
  next()
}

module.exports = { confirmOTP }