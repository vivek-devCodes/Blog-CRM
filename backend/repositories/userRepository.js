const User = require("../models/User");

// Find by email
exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find by reset token
exports.findUserByResetToken = async (token) => {
  return await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
};

// Create
exports.createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

// Get all
exports.getUsers = async () => {
  return await User.find();
};

// Get by ID
exports.getUserById = async (id) => {
  return await User.findById(id);
};

// Update
exports.updateUser = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

// Delete
exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
