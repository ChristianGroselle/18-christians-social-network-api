const { ObjectId } = require("mongoose").Types;
const { Users } = require("../models");

module.exports = {
  getUsers(req, res) {
    Users.find()
      .select("-thoughts")
      .select("-friends")
      .then((users) => res.status(201).json(users))
      .catch((error) => res.status(500).json({ error: error.message }));
  },
  getSingleUser(req, res) {
    Users.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .populate("friends")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  createUser(req, res) {
    Users.create(req.body)
      .then((user) => res.status(201).json(user))
      .catch((err) => res.status(500).json(err));
  },
  deleteUser(req, res) {
    Users.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No such user exists" })
          : res.status(201).json({
              message: `User with id: ${req.params.userId} has been successfully deleted`,
            })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  updateUser(req, res) {
    Users.findByIdAndUpdate(req.params.userId, req.body, { new: true })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this id!" })
          : res.status(201).json({
              message: `User with id: ${req.params.userId} has been successfully updated`,
              user,
            })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  addFriend(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: `No user found with the id: ${req.params.userId}`,
            })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  removeFriend(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: `No user found with the id: ${req.params.userId}`,
            })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
