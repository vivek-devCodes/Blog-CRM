const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");

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
