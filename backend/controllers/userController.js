const userService = require("../services/userService");

// Create user
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create user",
      data: null,
    });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
      data: null,
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user",
      data: null,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update user",
      data: null,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
      data: null,
    });
  }
};
