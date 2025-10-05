const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    email: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 50,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 15,
      match: /^0[1-9]{1}[0-9]{8}$/,
    },

    address: {
      type: String,
      required: true,
    },

    avatar_url: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    role: { type: Number, ref: "Permission", default: 4, immutable: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
