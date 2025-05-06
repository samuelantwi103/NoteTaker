const { Router } = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const { backupDatabse, backupUserData } = require("../controllers/backup-controllers");
const isAdminMiddleware = require("../middleware/admin-middleware");


const route = Router()

route.get('/database', authMiddleware, isAdminMiddleware, backupDatabse)
route.get('/user-data', authMiddleware, isAdminMiddleware, backupUserData)

module.exports = route