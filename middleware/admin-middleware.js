const isAdminMiddleware = (req, res, next) => {
  if (req.userData.role !== "admin" && req.userData.role !== "superadmin") {
    return res.status(403).send({
      status: true,
      message: "Access denied!!! Admin rights required.",
    });
  }
  next()
}

module.exports = isAdminMiddleware