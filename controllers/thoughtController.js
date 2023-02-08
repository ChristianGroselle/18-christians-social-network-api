const { DataTypes } = require("mongoose");
const { Thoughts, Users } = require("../models");

module.exports = {
  getThoughts(req, res) {
    Thoughts.find()
      .then((thoughts) => res.json(thoughts))
      .catch((error) => res.status(500).json({ error: error.message }));
  },
  getSingleThought(req, res) {
    Thoughts.findOne({ _id: req.params.thoughtId })
      .populate("reactions")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  addThought(req, res) {
    Thoughts.create(req.body)
      .then((thought) => {
        return Users.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: `thought added, but no user was found with the id: ${req.body.userId}`,
            })
          : res.status(201).json(`Thought added successfully`)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thoughts.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No such thought exists" })
          : res.status(201).json({
              message: `thought with id: ${req.params.thoughtId} has been successfully deleted`,
            })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  updateThought(req, res) {
    Thoughts.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.status(201).json({
              message: `Thought with id: ${req.params.thoughtId} has been successfully updated`,
              thought,
            })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  addReaction(req, res) {
    Thoughts.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      {
        $addToSet: {
          reactions: {
            reactionBody: req.body.reactionBody,
            username: req.body.username,
          },
        },
      },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Thought not found" })
          : res
              .status(201)
              .json({ message: "reaction added successfully", thought })
      )
      .catch((err) => res.status(400).json(err));
  },
  removeReaction(req, res) {
    Thoughts.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Thought not found" })
          : res
              .status(201)
              .json({ message: "reaction removed successfully", thought })
      )
      .catch((err) => res.status(400).json(err));
  },
};
