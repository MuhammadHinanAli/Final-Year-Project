// Import the mongoose library to define schemas and interact with MongoDB
const mongoose = require("mongoose");

// Define the LectureProgress schema
// Tracks the progress of a specific lecture within a course
const LectureProgressSchema = new mongoose.Schema({
    lectureId: String,      // ID of the lecture
    viewed: Boolean,        // Whether the lecture has been viewed by the student
    dateViewed: Date,       // Date when the lecture was viewed
});

// Define the CourseProgress schema
// Represents the progress of a student in a specific course
const CourseProgressSchema = new mongoose.Schema({
    userId: String,            // ID of the student (user)
    courseId: String,          // ID of the course
    completed: Boolean,        // Whether the student has completed the course
    completionDate: Date,      // Date when the course was completed
    lecturesProgress: [        // Array to store progress of each lecture within the course
        LectureProgressSchema, // Referencing the LectureProgressSchema
    ],
});

// Export the Progress model based on the CourseProgressSchema
// This model can be used to interact with the "progress" collection in MongoDB
module.exports = mongoose.model("Progress", CourseProgressSchema);
