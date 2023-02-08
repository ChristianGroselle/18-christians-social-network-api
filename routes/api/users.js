const user = require("express").Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend,
} = require("../../controllers/userController");

user.route("/").get(getUsers).post(createUser);

user.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser);

user.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = user;
