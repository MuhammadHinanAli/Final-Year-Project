// Import the Express framework
const express = require("express");

// Import controller functions for handling instructor course operations
const {
    addNewCourse,
    getAllCourses,
    getCourseDetailsByID,
    updateCourseByID,
} = require("../../controllers/instructor-controller/course-controller");

// Create a new Express router instance
const router = express.Router();

// Route to add a new course (POST request)
// Endpoint: /instructor/course/add
router.post("/add", addNewCourse);

// Route to get all courses created by instructors (GET request)
// Endpoint: /instructor/course/get
router.get("/get", getAllCourses);

// Route to get course details by ID (GET request with path parameter)
// Endpoint: /instructor/course/get/details/:id
router.get("/get/details/:id", getCourseDetailsByID);

// Route to update a course by ID (PUT request with path parameter)
// Endpoint: /instructor/course/update/:id
router.put("/update/:id", updateCourseByID);

// Export the router so it can be used in the main server file
module.exports = router;
