const { authenticateToken } = require("../middleware/auth");

// Get dashboard data
exports.getDashboard = async (req, res) => {
  try {
    // This endpoint is protected by authenticateToken middleware
    // If we reach here, the user is authenticated
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt
    };

    // Mock dashboard data - replace with your actual dashboard logic
    const dashboardData = {
      user: userData,
      stats: {
        totalUsers: 150,
        activeUsers: 120,
        newUsers: 25,
        revenue: 12500
      },
      recentActivity: [
        {
          id: 1,
          action: "User registered",
          timestamp: new Date().toISOString(),
          user: "John Doe"
        },
        {
          id: 2,
          action: "Profile updated",
          timestamp: new Date().toISOString(),
          user: "Jane Smith"
        },
        {
          id: 3,
          action: "Login successful",
          timestamp: new Date().toISOString(),
          user: "Mike Johnson"
        }
      ]
    };

    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboardData,
      isAuthenticated: true
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve dashboard data",
      data: null,
      isAuthenticated: false
    });
  }
};
