# Authentication & Authorization System

## Overview
This project implements a comprehensive authentication and authorization system using JWT tokens stored in secure HTTP-only cookies.

## Features
- ✅ JWT-based authentication
- ✅ Secure HTTP-only cookies
- ✅ Protected routes with middleware
- ✅ Session management
- ✅ Automatic token verification
- ✅ Logout functionality
- ✅ Frontend authentication context

## Security Features
- **HTTP-Only Cookies**: Tokens are stored in HTTP-only cookies to prevent XSS attacks
- **Secure Cookies**: Cookies are marked as secure in production
- **SameSite Protection**: Cookies use SameSite=strict to prevent CSRF attacks
- **Token Expiration**: Access tokens expire in 24 hours, refresh tokens in 7 days
- **Protected Routes**: All sensitive endpoints require authentication

## Environment Variables Required
Create a `.env` file in the backend directory with:

```env
# Database
MONGO_URI=mongodb://localhost:27017/crm-database

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-make-it-different-and-random

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Public Endpoints
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `POST /api/users` - User registration
- `POST /api/users/forgot-password` - Password reset
- `POST /api/users/check-email` - Check if email exists

### Protected Endpoints (Require Authentication)
- `GET /api/users/verify` - Verify authentication status
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/dashboard` - Get dashboard data

## Frontend Authentication

### AuthContext
The frontend uses React Context for authentication state management:
- `useAuth()` hook provides authentication methods
- Automatic token verification on app load
- Protected route components
- Automatic redirects for unauthenticated users

### Protected Routes
- Dashboard page is protected and requires authentication
- Unauthenticated users are redirected to login
- Loading states while verifying authentication

## How It Works

1. **Login Process**:
   - User submits credentials
   - Server validates credentials
   - JWT tokens are generated
   - Tokens are stored in HTTP-only cookies
   - User is redirected to dashboard

2. **Authentication Verification**:
   - Frontend automatically verifies auth on load
   - Protected routes check authentication status
   - Unauthenticated users are redirected to login

3. **Session Management**:
   - Access tokens expire in 24 hours
   - Refresh tokens expire in 7 days
   - Cookies are automatically sent with requests
   - Logout clears all authentication cookies

## Security Considerations

- **Never store tokens in localStorage**: Use HTTP-only cookies only
- **Use HTTPS in production**: Secure cookies require HTTPS
- **Rotate JWT secrets regularly**: Change secrets in production
- **Implement rate limiting**: Add rate limiting to login endpoints
- **Add CSRF protection**: Consider CSRF tokens for additional security

## Testing Authentication

1. **Test Protected Routes**:
   - Try accessing `/dashboard` without login (should redirect to login)
   - Login and verify dashboard access
   - Test logout functionality

2. **Test Session Persistence**:
   - Login and refresh the page
   - Verify you remain logged in
   - Test token expiration

3. **Test Security**:
   - Verify cookies are HTTP-only
   - Test that tokens aren't accessible via JavaScript
   - Verify proper error handling for invalid tokens
