const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
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

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
      maxlength: 50,
    },

    phoneNumber: {
      type: String,
      unique: true,
      required: true,
      minlength: 10,
      maxlength: 15,
      match: /^0[1-9]{1}[0-9]{8}$/,
    },

    address: {
      type: String,
    },

    avatar_url: {
      type: String,
    },

    role: { type: Number, ref: "Permission", default: 1, immutable: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
