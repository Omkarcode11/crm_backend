const User = require("../models/user.model");
const { userStatus } = require("../utils/constants");


exports.findAll = async (req, res) => {
  try {
    let query = req.query
    let users = await User.find(query);
    if (users) {

      let sendArr = []

      for (let i = 0; i < users.length; i++) {
        let obj = {}
        obj._id = users[i]._id,
          obj.name = users[i].name,
          obj.userId = users[i].userId,
          obj.email = users[i].email,
          obj.userStatus = users[i].userStatus,
          obj.ticketsCreated = users[i].ticketsCreated.length,
          obj.ticketsAssigned = users[i].ticketsAssigned.length

        sendArr.push(obj)
      }
      return res.status(200).send(sendArr);
    }
  } catch (err) {
    return res.status(500).send("Internal Error");
  }
};

exports.findById = async (req, res) => {
  let id = req.params.userId;
  let user = await User.findOne({ userId: id });
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({ msg: "User not found" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // name email userStatus usertype
    let id = req.params.userId;
    let updatedValue = req.body;
    let user = await User.findOneAndUpdate(
      { userId: id }, updatedValue);

    if (user) {
      return res.status(200).send("user updated successfully");
    } else {
      return res.status(200).send("user not Found");
    }
  } catch (err) {
    return res.status(500).json('internal Error');
  }
};
