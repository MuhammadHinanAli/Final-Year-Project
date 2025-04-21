// Import the Express framework
const express = require("express");

// Import controller functions for handling course progress
const {
  getCurrentCourseProgress,
  markCurrentLectureAsViewed,
  resetCurrentCourseProgress,
} = require("../../controllers/student-controller/course-progress-controller");

// Create a new Express router instance
const router = express.Router();

// Route to get the current progress of a user in a specific course (GET request)
// Endpoint: /student/course-progress/get/:userId/:courseId
// :userId - ID of the student
// :courseId - ID of the course
router.get("/get/:userId/:courseId", getCurrentCourseProgress);

// Route to mark a lecture as viewed by the student (POST request)
// Endpoint: /student/course-progress/mark-lecture-viewed
// Expected to receive user ID, course ID, and lecture info in the request body
router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);

// Route to reset a student's progress in a course (POST request)
// Endpoint: /student/course-progress/reset-progress
// Expected to receive user ID and course ID in the request body
router.post("/reset-progress", resetCurrentCourseProgress);

// Export the router so it can be used in the main server file
module.exports = router;
