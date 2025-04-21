// Import the Express framework
const express = require("express");

// Import controller function to get courses by student ID
const {
    getCoursesByStudentId,
} = require("../../controllers/student-controller/student-courses-controller");

// Create a new Express router instance
const router = express.Router();

// Route to get all courses purchased or enrolled by a student (GET request)
// Endpoint: /student/courses-bought/get/:studentId
// :studentId - ID of the student whose courses are being retrieved
router.get("/get/:studentId", getCoursesByStudentId);

// Export the router so it can be used in the main server file
module.exports = router;
