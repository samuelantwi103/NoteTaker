const { Router } = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const { updateUser, setRole } = require("../controllers/user-controllers");
const { resetPassword } = require("../controllers/user-controllers");
const isSuperAdminMiddleware = require("../middleware/superadmin-middleware");


const route = Router()

route.put('/set-role', authMiddleware, isSuperAdminMiddleware, setRole)
route.put('/reset-password', authMiddleware, resetPassword)
route.put('/update-info', authMiddleware, updateUser)

module.exports = route