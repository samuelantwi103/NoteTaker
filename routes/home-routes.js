const { Router } = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const { welcomeUser } = require("../controllers/home-controllers");

const route = Router()

route.get('/get', authMiddleware, welcomeUser)

module.exports = route