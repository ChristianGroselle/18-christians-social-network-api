const thought = require("express").Router();
const {
  getThoughts,
  getSingleThought,
  addThought,
  deleteThought,
  updateThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thoughtController");

thought.route("/").get(getThoughts).post(addThought);

thought
  .route("/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

thought.route("/:thoughtId/reactions").post(addReaction);

thought.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = thought;
