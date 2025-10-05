import User from "../../models/humanResources/user.model.js";
import userService from "../../services/humanResources/userService.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import _ from "lodash";

const userController = {
  // Register User
  registerUser: async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Login User
  loginUser: async (req, res) => {
    try {
      const user = await userService.checkPassword(
        req.body.email,
        req.body.password
      );

      const accessToken = generateAccessToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      res
        .status(200)
        .json({ message: "Login successful", user, accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get An User
  getUser: async (req, res) => {
    try {
      const user = await userService.getById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get All Users
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update User
  updateUser: async (req, res) => {
    try {
      const updateData = _.pick(req.body, [
        "firstName",
        "lastName",
        "userName",
        "fullName",
        "email",
        "phoneNumber",
        "address",
        "avatar_url",
        "status",
      ]);

      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete User
  deleteUser: async (req, res) => {
    try {
      const user = await userService.delete(req.params.id);
      res.status(200).json({
        message: "User deleted successfully",
        id: user._id,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Change Password
  changePassword: async (req, res) => {
    try {
      const updateData = _.pick(req.body, ["oldPassword", "newPassword"]);
      if (!updateData.oldPassword || !updateData.newPassword) {
        return res.status(400).json({ message: "Missing old or new password" });
      }

      const user = await userService.changePassword(
        req.params.id,
        updateData.oldPassword,
        updateData.newPassword
      );
      res.status(200).json({ message: "Password changed successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default userController;
