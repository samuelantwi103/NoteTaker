const { Router } = require("express");
const { loginUser, registerUser } = require("../controllers/auth-controllers");



const route = Router()
route.post('/login', loginUser)
route.post('/register', registerUser)

module.exports = route