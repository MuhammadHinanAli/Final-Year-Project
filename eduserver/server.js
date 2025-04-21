// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import necessary modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import route handlers
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");

// Initialize the Express application
const app = express();

// Set the server port, default to 5000 if not specified in environment
const PORT = process.env.PORT || 5000;

// Get the MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Enable Cross-Origin Resource Sharing (CORS) to allow frontend to communicate with backend
app.use(
  cors({
    origin: process.env.CLIENT_URL, // allow requests from the client URL
    methods: ["GET", "POST", "DELETE", "PUT"], // allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // allowed headers in requests
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB using mongoose
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb is connected")) // on successful connection
  .catch((e) => console.log(e)); // log any connection error

// Set up route handlers for different API endpoints
app.use("/auth", authRoutes); // authentication routes
app.use("/media", mediaRoutes); // instructor media upload routes
app.use("/instructor/course", instructorCourseRoutes); // instructor course management routes
app.use("/student/course", studentViewCourseRoutes); // student course viewing routes
app.use("/student/order", studentViewOrderRoutes); // student order-related routes
app.use("/student/courses-bought", studentCoursesRoutes); // student purchased courses routes
app.use("/student/course-progress", studentCourseProgressRoutes); // student course progress routes

// Global error handler middleware
app.use((err, req, res, next) => {
  console.log(err.stack); // log the error stack for debugging
  res.status(500).json({
    success: false,
    message: "Something went wrong", // send generic error response
  });
});

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
