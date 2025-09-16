const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../config/email");

exports.forgotPassword = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    return null;
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  // Send email
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  return user;
};

exports.loginUser = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }
  return user;
};

exports.findUserByEmail = (email) => {
  return userRepository.findUserByEmail(email);
};

exports.createUser = async (userData) => {
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);
  return userRepository.createUser(userData);
};

exports.getUsers = () => {
  return userRepository.getUsers();
};

exports.getUserById = (id) => {
  return userRepository.getUserById(id);
};

exports.updateUser = (id, userData) => {
  return userRepository.updateUser(id, userData);
};

exports.deleteUser = (id) => {
  return userRepository.deleteUser(id);
};
