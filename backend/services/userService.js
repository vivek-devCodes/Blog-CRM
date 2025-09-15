const userRepository = require("../repositories/userRepository");

exports.createUser = (userData) => {
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
