const isAdminMiddleware = (req, res, next) => {
  if (req.userData.role !== "admin") {
    return res.status(403).send({
      status: true,
      message: "Access denied!!! Admin rights required.",
    });
  }
  next()
}

module.exports = isAdminMiddleware