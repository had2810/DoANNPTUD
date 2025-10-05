import { comparePassword, hashPassword } from "../utils/passwordHash.js";

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

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const changePasswordService = (Model) => ({
  changePassword: async (userId, oldPassword, newPassword) => {
    const user = await Model.findById(userId).select("+password");
    if (!user) {
      throw new Error("User not found");
    }

    if (!oldPassword) {
      throw new Error("Old password is missing");
    }

    if (!user.password) {
      throw new Error("User password not found in database");
    }

    const isPasswordCorrect = await comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Old password is incorrect");
    }

    const { isValid, errors } = validatePasswordStrength(newPassword);
    if (!isValid) {
      throw new Error(errors.join(" "));
    }

    user.password = await hashPassword(newPassword);
    await user.save();
  },
});

export default changePasswordService;
