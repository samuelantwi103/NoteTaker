const jwt = require("jsonwebtoken")


const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization
    const token = header && header.split(' ')[1]
    // console.log(token)
    if (!token) {
      return res.status(500).json({
        status: false,
        message: "No token provided",
        // error: e.toString()
      })
    }

    req.userData = jwt.verify(token, process.env.JWT_SECRET_KEY)
    // console.log(req.userData)
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: `An error occurred: ${e.toString()}`
    })
  }
  next()
}

module.exports = authMiddleware