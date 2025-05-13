const { db } = require("../database/db")
const { mail } = require("../services/mail-service")

const createOTP = async (req, res) => {
  const { username, email } = req.body

  const otp = db.createOTP(username, email, null)
  if (!otp) {
    return res.status(404).json({
      success: false,
      message: "User not found!"
    })
  }
  userInfo = db.findUser(username, email)

  try {
    html = `<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h3 style="color: #28a745;">Note Taker OTP Request</h3>
    <p>Hi <strong>${userInfo.firstName}</strong> 👋🏽</p>
    <p>To continue with your request, please use the One-Time Password (OTP) below:</p>

    <p style="font-size: 24px; font-weight: bold; color: #28a745; background-color: #e9f7ef; padding: 10px; text-align: center; border-radius: 4px;">
      ${otp}
    </p>

    <p style="margin-top: 20px;">Please <strong>do not share this code</strong> with anyone — even if they claim to be from our team.</p>

    <p>If you didn't request this code, you can safely ignore this message or <a href="mailto:notetakerserver@gmail.com">contact our support team</a>.</p>

    <p style="margin-top: 30px;">Thank you,<br>
    <strong>Note Taker Security Team</strong></p>
  </div>
</body>`
    const message = await mail.sendMail([userInfo.email], "Note Taker OTP Request", null, html);
    // console.log(message)
    if (!message) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP"
      })
    }
    if (message.status === false) {
      return res.status(500).json({
        success: false,
        message: `An error occurred: ${message.error}`
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(501).json({
      success: false,
      message: `An error occurred: ${error.toString()}`
    })
  }

  return res.status(200).json({
    success: true,
    message: "OTP generated successfully!",
    // otp
  })
}

const verifyOTP = (req, res) => {
  try {
    const { username, email, otp, clear, activate } = req.body
    var isVerified = db.verifyOTP(username, email, otp)
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

    // Activation
    if (activate === true)
      isVerified = db.activateUser(username, email)
    if (clear === true && activate === undefined)
      db.clearOTP(username, email)
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
      message: `An error occurred: ${error.toString()}`
    })
  }
  console.log('OTP Verified')
  return res.status(200).json({
    success: true,
    message: "OTP confirmed successfully!",
    // otp
  })


}



module.exports = { createOTP, verifyOTP }