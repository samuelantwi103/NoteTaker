const { Router } = require("express");
const { loginUser, registerUser, forgotPassword } = require("../controllers/auth-controllers");
const { confirmOTP, verifyEmail } = require("../middleware/otp-middleware");
const authMiddleware = require('../middleware/auth-middleware');
const { createOTP, verifyOTP } = require("../controllers/otp-controllers");



const route = Router()
route.post('/login', loginUser)
route.post('/register', verifyEmail, registerUser)
route.put('/forgot-password', confirmOTP, forgotPassword)
route.post('/request-otp', createOTP)
route.post('/verify-otp', verifyOTP)

module.exports = route