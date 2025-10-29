let { body, validationResult } = require("express-validator");
let { Response } = require("./responseHandler");
let constants = require("./constants");
let util = require("util");

let options = {
  optionPassword: {
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
  },
};

module.exports = {
  // User validators
  validatorUserRegister: [
    body("firstName")
      .notEmpty()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME)
      .isLength({ min: 2 })
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME),
    body("lastName")
      .notEmpty()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME)
      .isLength({ min: 2 })
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME),
    body("userName")
      .isAlphanumeric()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_USERNAME)
      .isLength({ min: 6, max: 20 })
      .withMessage("Tên đăng nhập phải có độ dài từ 6-20 ký tự"),
    body("email")
      .isEmail()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_EMAIL)
      .isLength({ min: 6, max: 50 })
      .withMessage("Email phải có độ dài từ 6-50 ký tự"),
    body("password")
      .isStrongPassword(options.optionPassword)
      .withMessage(
        util.format(
          constants.MESSAGE_ERROR_VALIDATOR_PASSWORD,
          options.optionPassword.minLength,
          options.optionPassword.minSymbols,
          options.optionPassword.minLowercase,
          options.optionPassword.minUppercase,
          options.optionPassword.minNumbers
        )
      ),
    body("phoneNumber")
      .matches(/^0[1-9]{1}[0-9]{8}$/)
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_PHONE),
    body("address")
      .notEmpty()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_ADDRESS),
    body("avatar_url")
      .optional()
      .isURL()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_URL),
  ],

  validatorUserUpdate: [
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME)
      .isLength({ min: 2 })
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME),
    body("lastName")
      .optional()
      .notEmpty()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME)
      .isLength({ min: 2 })
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME),
    body("userName")
      .optional()
      .isAlphanumeric()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_USERNAME)
      .isLength({ min: 6, max: 20 })
      .withMessage("Tên đăng nhập phải có độ dài từ 6-20 ký tự"),
    body("email")
      .optional()
      .isEmail()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_EMAIL)
      .isLength({ min: 6, max: 50 })
      .withMessage("Email phải có độ dài từ 6-50 ký tự"),
    body("phoneNumber")
      .optional()
      .matches(/^0[1-9]{1}[0-9]{8}$/)
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_PHONE),
    body("address")
      .optional()
      .notEmpty()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_ADDRESS),
    body("avatar_url")
      .optional()
      .isURL()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_URL),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Trạng thái phải là active hoặc inactive"),
  ],

  validatorUserChangePassword: [
    body("oldPassword")
      .notEmpty()
      .withMessage("Mật khẩu cũ là bắt buộc"),
    body("newPassword")
      .isStrongPassword(options.optionPassword)
      .withMessage(
        util.format(
          constants.MESSAGE_ERROR_VALIDATOR_PASSWORD,
          options.optionPassword.minLength,
          options.optionPassword.minSymbols,
          options.optionPassword.minLowercase,
          options.optionPassword.minUppercase,
          options.optionPassword.minNumbers
        )
      ),
  ],

  // Employee validators
  validatorEmployeeCreate: [
    body("firstName")
      .notEmpty()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME)
      .isLength({ min: 2 })
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME),
    body("lastName")
      .notEmpty()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME)
      .isLength({ min: 2 })
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME),
    body("password")
      .isStrongPassword(options.optionPassword)
      .withMessage(
        util.format(
          constants.MESSAGE_ERROR_VALIDATOR_PASSWORD,
          options.optionPassword.minLength,
          options.optionPassword.minSymbols,
          options.optionPassword.minLowercase,
          options.optionPassword.minUppercase,
          options.optionPassword.minNumbers
        )
      ),
    body("email")
      .isEmail()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_EMAIL)
      .isLength({ min: 6, max: 50 })
      .withMessage("Email phải có độ dài từ 6-50 ký tự"),
    body("phoneNumber")
      .matches(/^0[1-9]{1}[0-9]{8}$/)
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_PHONE),
    body("address")
      .optional()
      .notEmpty()
      .withMessage("Địa chỉ không hợp lệ"),
    body("avatar_url")
      .optional()
      .isURL()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_URL),
  ],

  validatorEmployeeUpdate: [
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME)
      .isLength({ min: 2 })
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME),
    body("lastName")
      .optional()
      .notEmpty()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME)
      .isLength({ min: 2 })
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_NAME),
    body("email")
      .optional()
      .isEmail()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_EMAIL)
      .isLength({ min: 6, max: 50 })
      .withMessage("Email phải có độ dài từ 6-50 ký tự"),
    body("phoneNumber")
      .optional()
      .matches(/^0[1-9]{1}[0-9]{8}$/)
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_PHONE),
    body("address")
      .optional()
      .notEmpty()
      .withMessage("Địa chỉ không hợp lệ"),
    body("avatar_url")
      .optional()
      .isURL()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_URL),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Trạng thái phải là active hoặc inactive"),
  ],

  // Permission validators
  validatorPermissionCreate: [
    body("_id")
      .isNumeric()
      .withMessage("ID phải là số")
      .isInt({ min: 1 })
      .withMessage("ID phải là số nguyên dương"),
    body("role")
      .notEmpty()
      .withMessage("Vai trò không được để trống"),
    body("permissions")
      .isArray({ min: 1 })
      .withMessage("Danh sách quyền phải có ít nhất 1 phần tử"),
  ],

  validatorPermissionUpdate: [
    body("role")
      .optional()
      .notEmpty()
      .withMessage("Vai trò không được để trống"),
    body("permissions")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Danh sách quyền phải có ít nhất 1 phần tử"),
  ],

  // Device Template validators
  validatorDeviceTemplateCreate: [
    body("name")
      .notEmpty()
      .withMessage("Tên thiết bị không được để trống")
      .trim(),
    body("type")
      .isIn(["Laptop", "Phone", "Tablet", "PC", "Other"])
      .withMessage("Loại thiết bị phải là một trong: Laptop, Phone, Tablet, PC, Other"),
    body("brand")
      .notEmpty()
      .withMessage("Thương hiệu không được để trống")
      .trim(),
    body("image_url")
      .optional()
      .isURL()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_URL),
  ],

  validatorDeviceTemplateUpdate: [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Tên thiết bị không được để trống")
      .trim(),
    body("type")
      .optional()
      .isIn(["Laptop", "Phone", "Tablet", "PC", "Other"])
      .withMessage("Loại thiết bị phải là một trong: Laptop, Phone, Tablet, PC, Other"),
    body("brand")
      .optional()
      .notEmpty()
      .withMessage("Thương hiệu không được để trống")
      .trim(),
    body("image_url")
      .optional()
      .isURL()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_URL),
    body("active")
      .optional()
      .isBoolean()
      .withMessage("Trạng thái phải là true hoặc false"),
  ],

  // Service validators
  validatorServiceCreate: [
    body("deviceTemplateId")
      .isMongoId()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_OBJECTID),
    body("serviceName")
      .notEmpty()
      .withMessage("Tên dịch vụ không được để trống")
      .trim(),
    body("serviceType")
      .notEmpty()
      .withMessage("Loại dịch vụ không được để trống")
      .trim(),
    body("estimatedDuration")
      .isNumeric()
      .withMessage("Thời gian ước tính phải là số")
      .isInt({ min: 1 })
      .withMessage("Thời gian ước tính phải là số nguyên dương"),
    body("price")
      .isNumeric()
      .withMessage("Giá phải là số")
      .isFloat({ min: 0 })
      .withMessage("Giá phải là số dương"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Mô tả không hợp lệ")
      .trim(),
    body("imageUrl")
      .optional()
      .isURL()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_URL),
  ],

  validatorServiceUpdate: [
    body("deviceTemplateId")
      .optional()
      .isMongoId()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_OBJECTID),
    body("serviceName")
      .optional()
      .notEmpty()
      .withMessage("Tên dịch vụ không được để trống")
      .trim(),
    body("serviceType")
      .optional()
      .notEmpty()
      .withMessage("Loại dịch vụ không được để trống")
      .trim(),
    body("estimatedDuration")
      .optional()
      .isNumeric()
      .withMessage("Thời gian ước tính phải là số")
      .isInt({ min: 1 })
      .withMessage("Thời gian ước tính phải là số nguyên dương"),
    body("price")
      .optional()
      .isNumeric()
      .withMessage("Giá phải là số")
      .isFloat({ min: 0 })
      .withMessage("Giá phải là số dương"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Mô tả không hợp lệ")
      .trim(),
    body("imageUrl")
      .optional()
      .isURL()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_URL),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Trạng thái phải là active hoặc inactive"),
  ],

  // Appointment validators
  validatorAppointmentCreate: [
    body("userId")
      .isMongoId()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_OBJECTID),
    body("deviceTemplateId")
      .isMongoId()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_OBJECTID),
    body("serviceId")
      .isMongoId()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_OBJECTID),
    body("employeeId")
      .optional()
      .isMongoId()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_OBJECTID),
    body("appointmentTime")
      .isISO8601()
      .withMessage("Thời gian hẹn phải là định dạng ngày hợp lệ")
      .custom((value) => {
        const appointmentDate = new Date(value);
        const now = new Date();
        if (appointmentDate <= now) {
          throw new Error(constants.MESSAGE_ERROR_VALIDATOR_FUTURE_DATE);
        }
        return true;
      }),
    body("description")
      .notEmpty()
      .withMessage("Mô tả không được để trống")
      .trim(),
    body("imageUrls")
      .optional()
      .isArray()
      .withMessage("Danh sách hình ảnh phải là mảng"),
    body("estimatedCost")
      .optional()
      .isNumeric()
      .withMessage("Chi phí ước tính phải là số")
      .isFloat({ min: 0 })
      .withMessage("Chi phí ước tính phải là số dương"),
    body("status")
      .optional()
      .isIn(["pending", "confirmed", "cancelled"])
      .withMessage("Trạng thái phải là pending, confirmed hoặc cancelled"),
  ],

  validatorAppointmentUpdate: [
    body("userId")
      .optional()
      .isMongoId()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_OBJECTID),
    body("deviceTemplateId")
      .optional()
      .isMongoId()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_OBJECTID),
    body("serviceId")
      .optional()
      .isMongoId()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_OBJECTID),
    body("employeeId")
      .optional()
      .isMongoId()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_OBJECTID),
    body("appointmentTime")
      .optional()
      .isISO8601()
      .withMessage("Thời gian hẹn phải là định dạng ngày hợp lệ")
      .custom((value) => {
        const appointmentDate = new Date(value);
        const now = new Date();
        if (appointmentDate <= now) {
          throw new Error(constants.MESSAGE_ERROR_VALIDATOR_FUTURE_DATE);
        }
        return true;
      }),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Mô tả không được để trống")
      .trim(),
    body("imageUrls")
      .optional()
      .isArray()
      .withMessage("Danh sách hình ảnh phải là mảng"),
    body("estimatedCost")
      .optional()
      .isNumeric()
      .withMessage("Chi phí ước tính phải là số")
      .isFloat({ min: 0 })
      .withMessage("Chi phí ước tính phải là số dương"),
    body("status")
      .optional()
      .isIn(["pending", "confirmed", "cancelled"])
      .withMessage("Trạng thái phải là pending, confirmed hoặc cancelled"),
  ],

  // Common validators
  validatorLogin: [
    body("email")
      .isEmail()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_EMAIL),
    body("password")
      .notEmpty()
      .withMessage("Mật khẩu không được để trống"),
  ],

  validatorForgotPassword: [
    body("email")
      .isEmail()
      .withMessage(constants.MESSAGE_ERROR_VALIDATOR_EMAIL),
  ],

  validatorChangeAvatar: [
    body("avatar_url")
      .isURL()
      .withMessage("avatar_url phải là một đường dẫn hợp lệ (URL)"),
  ],

  // Validation result handler
  validatedResult: function (req, res, next) {
    let result = validationResult(req);
    console.log(result);
    if (result.errors.length > 0) {
      Response(res, 400, false, result.errors);
    } else {
      next();
    }
  },
};
