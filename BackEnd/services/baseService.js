import bcrypt from "bcrypt";
import { comparePassword } from "../utils/passwordHash.js";

const queryWithPopulate = (query, populateFields = []) => {
  populateFields.forEach((field) => {
    // Hỗ trợ cả string và object có path
    if (
      typeof field === "string" ||
      (typeof field === "object" && field.path)
    ) {
      query = query.populate(field);
    }
  });
  return query;
};

const baseService = (Model, options = {}) => ({
  // Tạo mới một bản ghi
  create: async (data) => {
    return await new Model(data).save();
  },

  // Lấy một bản ghi theo ID
  getById: async (id) => {
    return await queryWithPopulate(Model.findById(id), options.populateFields);
  },

  // Lấy tất cả bản ghi
  getAll: async () => {
    return await queryWithPopulate(Model.find(), options.populateFields);
  },

  // Cập nhật một bản ghi theo ID
  update: async (id, newData) => {
    return await Model.findByIdAndUpdate(id, newData, { new: true });
  },

  // Xóa một bản ghi theo ID
  delete: async (id) => {
    return await Model.findByIdAndDelete(id);
  },

  // Xóa nhiều bản ghi theo điều kiện
  deleteMany: async (condition) => {
    return await Model.deleteMany(condition);
  },

  // Lấy một bản ghi theo điều kiện
  getOne: async (condition) => {
    return await Model.findOne(condition);
  },

  // Check password
  checkPassword: async (email, password) => {
    const model = await Model.findOne({ email: email }).select("+password");
    if (!model) {
      throw new Error("User not found");
    }
    password = password.trim();
    const validPassword = await comparePassword(password, model.password);
    if (!validPassword) {
      throw new Error("Wrong password");
    }
    if (!model && !validPassword) {
      throw new Error("User not found or wrong password");
    }
    return model;
  },
});

export default baseService;
