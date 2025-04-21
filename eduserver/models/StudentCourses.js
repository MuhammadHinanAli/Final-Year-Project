// Import the mongoose library to define schemas and interact with MongoDB
const mongoose = require("mongoose");

// Define the StudentCourses schema
// Represents the courses a student has purchased or enrolled in
const StudentCoursesSchema = new mongoose.Schema({
    userId: String,                    // ID of the student
    courses: [                          // Array of courses the student has enrolled in or purchased
        {
            courseId: String,           // ID of the course
            title: String,              // Title of the course
            instructorId: String,      // ID of the instructor teaching the course
            instructorName: String,    // Name of the instructor
            dateOfPurchase: Date,      // Date when the student purchased or enrolled in the course
            courseImage: String,       // URL of the course image (e.g., thumbnail)
        },
    ],
});

// Export the StudentCourses model based on the StudentCoursesSchema
// This model can be used to interact with the "studentcourses" collection in MongoDB
module.exports = mongoose.model("StudentCourses", StudentCoursesSchema);
