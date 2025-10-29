const bcrypt = require("bcryptjs");
const { comparePassword } = require("../utils/passwordHash");

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
  // options: { includeDeleted: boolean }
  getById: async (id, opts = {}) => {
    const { includeDeleted = false } = opts || {};
    // If model supports soft-delete, ensure we only return non-deleted documents unless includeDeleted=true
    if (Model.schema && Model.schema.path("isDeleted") && !includeDeleted) {
      // Match documents where isDeleted is not true (covers false or missing field)
      return await queryWithPopulate(
        Model.findOne({ _id: id, isDeleted: { $ne: true } }),
        options.populateFields
      );
    }
    return await queryWithPopulate(Model.findById(id), options.populateFields);
  },

  // Lấy tất cả bản ghi
  // condition: filter object
  // opts: { includeDeleted: boolean }
  getAll: async (condition = {}, opts = {}) => {
    const { includeDeleted = false } = opts || {};
    // Merge caller condition with isDeleted filter when supported and not including deleted
    if (Model.schema && Model.schema.path("isDeleted") && !includeDeleted) {
      // Match documents where isDeleted is not true (covers false or missing field)
      condition = { ...condition, isDeleted: { $ne: true } };
    }
    return await queryWithPopulate(Model.find(condition), options.populateFields);
  },

  // Cập nhật một bản ghi theo ID
  update: async (id, newData) => {
    return await Model.findByIdAndUpdate(id, newData, { new: true });
  },

  // Xóa một bản ghi theo ID (soft-delete by default; use opts.hard=true to hard delete)
  // opts: { hard: boolean }
  delete: async (id, opts = {}) => {
    const { hard = false } = opts || {};
    if (hard) {
      return await Model.findByIdAndDelete(id);
    }
    if (Model.schema && Model.schema.path("isDeleted")) {
      return await Model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
    return await Model.findByIdAndDelete(id);
  },

  // Hard delete explicitly
  hardDelete: async (id) => {
    return await Model.findByIdAndDelete(id);
  },

  // Xóa nhiều bản ghi theo điều kiện (soft-delete by default; opts.hard=true to hard delete)
  // opts: { hard: boolean }
  deleteMany: async (condition = {}, opts = {}) => {
    const { hard = false } = opts || {};
    if (hard) {
      return await Model.deleteMany(condition);
    }
    if (Model.schema && Model.schema.path("isDeleted")) {
      return await Model.updateMany(condition, { isDeleted: true });
    }
    return await Model.deleteMany(condition);
  },

  // Lấy một bản ghi theo điều kiện
  // opts: { includeDeleted: boolean }
  getOne: async (condition = {}, opts = {}) => {
    const { includeDeleted = false } = opts || {};
    if (Model.schema && Model.schema.path("isDeleted") && !includeDeleted) {
      // Match documents where isDeleted is not true (covers false or missing field)
      condition = { ...condition, isDeleted: { $ne: true } };
    }
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

module.exports = baseService;
