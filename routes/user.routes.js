const { authJwt, verifySignUp } = require("../middlewares");

const userController = require("../controllers/user.controller");

module.exports = function (app) {
  app.get(
    "/crm/api/v1/user/",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.findAll
  );
  app.get(
    "/crm/api/v1/user/:userId",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.findById
  );
  app.put(
    "/crm/api/v1/user/:userId",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.updateUser
  );
};
