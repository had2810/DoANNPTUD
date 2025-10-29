const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      minlength: 6,
      maxlength: 40,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    password: {
      type: String,
      required: false,
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
      required: false,
      minlength: 10,
      maxlength: 15,
      match: /^0[1-9]{1}[0-9]{8}$/,
      unique: true,
     sparse: true, // Thêm dòng này
    },
    address: {
      type: String,
    },
    avatar_url: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    role: {
      type: Number,
      ref: "Permission",
      required: true,
      enum: [1, 2, 3, 4], // 1: Admin, 2: Employee, 3: Consultant, 4: User
    },
    isDeleted: { type: Boolean, default: false },
    // Forgot password token and expiry
    forgotPasswordToken: { type: String, default: "" },
    forgotPasswordTokenExp: { type: Date, default: null },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Static methods for different user types
userSchema.statics.createAdmin = function (userData) {
  return this.create({ ...userData, role: 1 });
};

userSchema.statics.createEmployee = function (userData) {
  // Nếu truyền role là 3 thì tạo tư vấn viên, còn lại là nhân viên
  let role = 2;
  if (userData.role === 3 || userData.role === "3") role = 3;
  return this.create({ ...userData, role });
};

userSchema.statics.createUser = function (userData) {
  return this.create({ ...userData, role: 4 });
};

// Instance methods to check user type
userSchema.methods.isAdmin = function () {
  return this.role === 1;
};

userSchema.methods.isEmployee = function () {
  return this.role === 2;
};

userSchema.methods.isUser = function () {
  return this.role === 4;
};

// Virtual for user type name
userSchema.virtual("userType").get(function () {
  switch (this.role) {
    case 1:
      return "Admin";
    case 2:
      return "Employee";
    case 3:
      return "Consultant";
    case 4:
      return "User";
    default:
      return "Unknown";
  }
});

const User = mongoose.model("User", userSchema);

// Export both the model and the schema for flexibility
module.exports = User;
module.exports.UserSchema = userSchema;