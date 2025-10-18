const { comparePassword, hashPassword } = require("../utils/passwordHash");

const validatePasswordStrength = (password) => {
  const lengthRule = /^.{8,}$/;
  const numberRule = /[0-9]/;
  const specialCharRule = /[!@#$%^&*(),.?":{}|<>]/;

  const errors = [];
  if (!lengthRule.test(password))
    errors.push("Password must be at least 8 characters long.");
  if (!numberRule.test(password))
    errors.push("Password must contain at least one number.");
  if (!specialCharRule.test(password))
    errors.push("Password must contain at least one special character.");

  return { isValid: errors.length === 0, errors };
};

const changePasswordService = (Model) => ({
  changePassword: async (userId, oldPassword, newPassword) => {
    const user = await Model.findById(userId).select("+password");
    if (!user) throw new Error("User not found");
    if (!oldPassword) throw new Error("Old password is missing");
    if (!user.password) throw new Error("User password not found in database");

    const isPasswordCorrect = await comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) throw new Error("Old password is incorrect");

    const { isValid, errors } = validatePasswordStrength(newPassword);
    if (!isValid) throw new Error(errors.join(" "));

    // ✅ Gán mật khẩu mới (plaintext)
    user.password = newPassword;

    // pre-save hook trong user.model.js sẽ tự hash lại mật khẩu
    await user.save();

    return { message: "Password changed successfully" };
  },
});

module.exports = changePasswordService;
