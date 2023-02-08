const { Schema, Types, model } = require("mongoose");

const { Users } = require("../models");

const reactionSchema = new Schema({
  reactionId: {
    type: Types.ObjectId,
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

thoughtSchema.pre("remove", function () {
  Users.updateMany(
    { thoughts: this._id },
    { $pull: { thoughts: this._id } }
  ).exec();
});

const Thoughts = model("Thoughts", thoughtSchema);

module.exports = Thoughts;
