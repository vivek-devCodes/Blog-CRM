const userService = require("../services/userService");
const { generateToken, generateRefreshToken } = require("../middleware/auth");

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.forgotPassword(email);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send password reset email",
      data: null,
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        isAuthenticated: false
      });
    }

    // Generate JWT tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set secure HTTP-only cookies
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
      isAuthenticated: true
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to login",
      data: null,
      isAuthenticated: false
    });
  }
};

// Check if email exists
exports.checkEmail = async (req, res) => {
  try {
    const user = await userService.findUserByEmail(req.body.email);
    if (user) {
      return res.status(200).json({
        exists: true,
      });
    }
    return res.status(200).json({
      exists: false,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to check email",
      data: null,
    });
  }
};

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

// Verify authentication status
exports.verifyAuth = async (req, res) => {
  try {
    // This endpoint is protected by authenticateToken middleware
    // If we reach here, the user is authenticated
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt
    };

    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      data: userData,
      isAuthenticated: true
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify authentication",
      data: null,
      isAuthenticated: false
    });
  }
};

// Logout user
exports.logoutUser = async (req, res) => {
  try {
    // Clear the authentication cookies
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: "Logout successful",
      isAuthenticated: false
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to logout",
      isAuthenticated: false
    });
  }
};
