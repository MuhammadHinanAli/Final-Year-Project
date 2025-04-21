// Import the mongoose library to define schemas and interact with MongoDB
const mongoose = require("mongoose");

// Define the Lecture schema
// A single lecture in a course, with a title, video URL, Cloudinary public ID, and a flag for free preview access
const LectureSchema = new mongoose.Schema({
    title: String,          // Title of the lecture
    videoUrl: String,       // URL of the video for the lecture
    public_id: String,      // Cloudinary public ID for media handling
    freePreview: Boolean,   // Whether the lecture has a free preview available
});

// Define the Course schema
// Represents a course, including the instructor, course details, and curriculum (lectures)
const CourseSchema = new mongoose.Schema({
    instructorId: String,       // ID of the instructor (could reference a user model)
    instructorName: String,     // Name of the instructor
    date: Date,                 // Date the course was created
    title: String,              // Title of the course
    category: String,           // Category of the course (e.g., "Programming", "Business")
    level: String,              // Difficulty level (e.g., "Beginner", "Advanced")
    primaryLanguage: String,    // Language in which the course is taught
    subtitle: String,           // Subtitle of the course
    description: String,        // Detailed description of the course content
    image: String,              // URL of the image representing the course
    welcomeMessage: String,     // Welcome message for students joining the course
    pricing: Number,            // Price of the course
    objectives: String,         // Learning objectives of the course
    students: [                 // Array of students who have enrolled in the course
        {
            studentId: String,     // Student's ID
            studentName: String,   // Student's name
            studentEmail: String,  // Student's email
            paidAmount: String,    // Amount paid by the student for the course
        },
    ],
    curriculum: [LectureSchema], // Array of lectures that make up the course
    isPublised: Boolean,         // Whether the course is published and available for students
});

// Export the Course model based on the CourseSchema
// This model can be used to interact with the "courses" collection in MongoDB
module.exports = mongoose.model("Course", CourseSchema);
