// Import the Express framework
const express = require("express");

// Import controller functions for handling student view of courses
const {
    getStudentViewCourseDetails,
    getAllStudentViewCourses,
    checkCoursePurchaseInfo,
} = require("../../controllers/student-controller/course-controller");

// Create a new Express router instance
const router = express.Router();

// Route to get all available courses that students can view (GET request)
// Endpoint: /student/course/get
router.get("/get", getAllStudentViewCourses);

// Route to get detailed information about a specific course (GET request)
// Endpoint: /student/course/get/details/:id
// :id - ID of the course
router.get("/get/details/:id", getStudentViewCourseDetails);

// Route to check if a student has purchased a specific course (GET request)
// Endpoint: /student/course/purchase-info/:id/:studentId
// :id - ID of the course
// :studentId - ID of the student
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);

// Export the router to be used in the main server file
module.exports = router;
