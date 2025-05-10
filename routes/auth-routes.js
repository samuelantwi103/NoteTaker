const { Router } = require("express");
const { loginUser, registerUser, resetPassword, updateUser } = require("../controllers/auth-controllers");
const { confirmOTP, verifyEmail } = require("../middleware/otp-middleware");
const authMiddleware = require('../middleware/auth-middleware');
const { createOTP, verifyOTP } = require("../controllers/otp-controllers");



const route = Router()
route.post('/login', loginUser)
route.post('/register', verifyEmail, registerUser)
route.put('/reset-password', confirmOTP, resetPassword)
route.post('/request-otp', createOTP)
route.post('/verify-otp', verifyOTP)
route.put('/update-info', authMiddleware, updateUser)
route.put('/set-role', authMiddleware, updateUser)

module.exports = route