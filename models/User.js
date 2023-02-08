const { Schema, Types, model } = require("mongoose");

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

const Users = model("Users", userSchema);

module.exports = Users;
