const express = require("express");
const userController = require("../../controllers/humanResources/userController.js");
const { checkAccessToken } = require("../../middleware/authJwtMiddleware.js");
const { checkRole } = require("../../middleware/checkRoleMiddleware.js");
const router = express.Router();

//Register User
router.post("/register", userController.registerUser);

//Login User
router.post("/login", userController.loginUser);

//Get An User
router.get("/:id", checkAccessToken, userController.getUser);

//Get All Users
router.get(
  "/",
  checkAccessToken,
  checkRole("admin"),
  userController.getAllUsers
);

//Update User
router.put("/:id", checkAccessToken, userController.updateUser);

// Soft-delete User
router.put(
  "/delete/:id",
  checkAccessToken,
  checkRole("admin"),
  userController.deleteUser
);

//Change Password
router.put("/:id/password", checkAccessToken, userController.changePassword);

module.exports = router;
