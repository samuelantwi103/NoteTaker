const welcomeUser = (req, res) => {

  res.status(200).json({
    success: true,
    message: `Welcome, ${req.userData.role}`
  })

}

module.exports = { welcomeUser }