const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendPasswordResetEmail, sendWelcomeEmail } = require("../config/email");

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
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  return user;
};

exports.resetPassword = async (token, newPassword) => {
  // Hash the token from URL to match against database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with valid token and unexpired expiration
  const user = await userRepository.findUserByResetToken(hashedToken);
  
  if (!user || user.resetPasswordExpires < Date.now()) {
    return null;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  
  // Clear reset token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  
  await user.save();
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
  
  // Create the user
  const user = await userRepository.createUser(userData);
  
  // Send welcome email after successful user creation
  try {
    await sendWelcomeEmail(user.email, user.name, user.email);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw error here to avoid breaking user creation
    // The user is already created successfully
  }
  
  return user;
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
