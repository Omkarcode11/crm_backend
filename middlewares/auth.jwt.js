const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");

const User = require("../models/user.model");
const constants = require("../utils/constants");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({ msg: "Not Auth Not token Provided" });
  }
  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ msg: "Request cannot be authenticated . Token is invalid" });
    }

    req.userId = decoded.id;

    next();
  });
};

isAdmin = async (req, res, next) => {
  const user = await User.findOne({ userId: req.userId });

  if (user && user.userType === constants.userTypes.admin) {
    next();
  } else {
    return res.status(403).send({
      message: "only admin are allowed this operation",
    });
  }
};

validateUpdating = async (req, res, next) => {
  let update = req.body;
  let valid = { name: true, email: true, userType: true, userStatus: true };
  for (const key in update) {
    if (!valid[key]) {
      return res.status(402).send("Your not able to update field");
    }
  }
  next();
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};

module.exports = authJwt;
