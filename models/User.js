const { Schema, Types, model } = require("mongoose");

const { Thoughts } = require("../models");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    thoughts: [
      {
        type: Types.ObjectId,
        ref: "Thoughts",
      },
    ],
    friends: [
      {
        type: Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual("friendCount").get(function () {
  Users.countDocuments({ friends: this._id }, (err, count) => {
    if (err) return next(err);
    this.friendCount = count;
  });
});

userSchema.pre("remove", function () {
  Thoughts.deleteMany({ username: this.username }).exec();
});

const Users = model("Users", userSchema);

module.exports = Users;
