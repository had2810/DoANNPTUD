const bcrypt = require("bcrypt");

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};


// 🔐 Hàm hash mật khẩu
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Tạo salt (độ mạnh 10)
  return bcrypt.hash(password, salt); // Hash password với salt
};
module.exports = {
  comparePassword,hashPassword 
};
