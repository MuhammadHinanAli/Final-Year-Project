// Import the Course model to interact with the courses collection in MongoDB
const Course = require("../../models/Course");

// Controller to add a new course
const addNewCourse = async (req, res) => {
    try {
        const courseData = req.body; // Get course data from the request body

        // Create a new Course instance using the data from the request body
        const newlyCreatedCourse = new Course(courseData);

        // Save the newly created course to the database
        const saveCourse = await newlyCreatedCourse.save();

        // If the course is saved successfully, send a response with status 201
        if (saveCourse) {
            res.status(201).json({
                success: true,
                message: "Course saved successfully", // Success message
                data: saveCourse, // Return the saved course data
            });
        }
    } catch (e) {
        console.log(e); // Log the error for debugging
        // If an error occurs, return a generic error response with status 500
        res.status(500).json({
            success: false,
            message: "Some error occured!", // Error message
        });
    }
};

// Controller to get all courses
const getAllCourses = async (req, res) => {
    try {
        // Find all courses from the database
        const coursesList = await Course.find({});

        // Return the list of courses with a success response
        res.status(200).json({
            success: true,
            data: coursesList, // List of all courses
        });
    } catch (e) {
        console.log(e); // Log the error for debugging
        // If an error occurs, return a generic error response with status 500
        res.status(500).json({
            success: false,
            message: "Some error occured!", // Error message
        });
    }
};

// Controller to get course details by ID
const getCourseDetailsByID = async (req, res) => {
    try {
        const { id } = req.params; // Get course ID from the request parameters

        // Find the course by its ID
        const courseDetails = await Course.findById(id);

        // If no course is found with the provided ID, return a 404 response
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found!", // Error message
            });
        }

        // Return the course details with a success response
        res.status(200).json({
            success: true,
            data: courseDetails, // Course details
        });
    } catch (e) {
        console.log(e); // Log the error for debugging
        // If an error occurs, return a generic error response with status 500
        res.status(500).json({
            success: false,
            message: "Some error occured!", // Error message
        });
    }
};

// Controller to update course details by ID
const updateCourseByID = async (req, res) => {
    try {
        const { id } = req.params; // Get course ID from the request parameters
        const updatedCourseData = req.body; // Get updated course data from the request body

        // Find the course by ID and update it with the new data
        const updatedCourse = await Course.findByIdAndUpdate(
            id, // Find the course by ID
            updatedCourseData, // The updated data
            { new: true } // Option to return the updated course data
        );

        // If no course is found with the provided ID, return a 404 response
        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found!", // Error message
            });
        }

        // Return the updated course with a success response
        res.status(200).json({
            success: true,
            message: "Course updated successfully", // Success message
            data: updatedCourse, // The updated course data
        });
    } catch (e) {
        console.log(e); // Log the error for debugging
        // If an error occurs, return a generic error response with status 500
        res.status(500).json({
            success: false,
            message: "Some error occured!", // Error message
        });
    }
};

// Export the controller functions to be used in the routes
module.exports = {
    addNewCourse,
    getAllCourses,
    updateCourseByID,
    getCourseDetailsByID,
};
