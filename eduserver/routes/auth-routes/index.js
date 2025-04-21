// Import the Express framework
const express = require("express");

// Import controller functions for registering and logging in users
const {
  registerUser,
  loginUser,
} = require("../../controllers/auth-controller/index");

// Import custom middleware for authenticating requests
const authenticateMiddleware = require("../../middleware/auth-middleware");

// Create a new Express router instance
const router = express.Router();

// Route for user registration (POST request)
// This will call the registerUser controller when /auth/register is hit
router.post("/register", registerUser);

// Route for user login (POST request)
// This will call the loginUser controller when /auth/login is hit
router.post("/login", loginUser);

// Protected route to check if the user is authenticated (GET request)
// Uses authenticateMiddleware to verify the user's token
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user; // user data attached by middleware

  // Send a successful response if the user is authenticated
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

// Export the router to be used in the main server file
module.exports = router;
