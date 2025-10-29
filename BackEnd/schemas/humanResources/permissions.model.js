const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },

    role: {
      type: String,
      required: true,
      unique: true,
    },

    permissions: {
      type: [String],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;
