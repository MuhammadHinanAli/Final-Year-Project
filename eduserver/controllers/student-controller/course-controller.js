// Importing models for interacting with Course and StudentCourses collections in MongoDB
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// Controller to get all courses with filters and sorting
const getAllStudentViewCourses = async (req, res) => {
    try {
        // Extracting query parameters, providing defaults for optional ones
        const {
            category = [],
            level = [],
            primaryLanguage = [],
            sortBy = "price-lowtohigh",
        } = req.query;

        let filters = {}; // Initialize the filters object
        if (category.length) {
            filters.category = { $in: category.split(",") }; // Filtering by categories
        }
        if (level.length) {
            filters.level = { $in: level.split(",") }; // Filtering by course levels
        }
        if (primaryLanguage.length) {
            filters.primaryLanguage = { $in: primaryLanguage.split(",") }; // Filtering by language
        }

        let sortParam = {}; // Initialize sorting parameter
        switch (sortBy) {
            case "price-lowtohigh":
                sortParam.pricing = 1; // Sort by price in ascending order
                break;
            case "price-hightolow":
                sortParam.pricing = -1; // Sort by price in descending order
                break;
            case "title-atoz":
                sortParam.title = 1; // Sort by title in ascending order
                break;
            case "title-ztoa":
                sortParam.title = -1; // Sort by title in descending order
                break;
            default:
                sortParam.pricing = 1; // Default sort by price in ascending order
                break;
        }

        // Fetch courses based on filters and sort parameters
        const coursesList = await Course.find(filters).sort(sortParam);

        // Return the courses list in the response
        res.status(200).json({
            success: true,
            data: coursesList, // Return the filtered and sorted courses
        });
    } catch (e) {
        console.log(e); // Log errors for debugging
        res.status(500).json({
            success: false,
            message: "Some error occured!", // Return an error message
        });
    }
};

// Controller to get details of a specific course
const getStudentViewCourseDetails = async (req, res) => {
    try {
        const { id } = req.params; // Get the course ID from the request parameters
        const courseDetails = await Course.findById(id); // Fetch the course details by ID

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "No course details found", // If no course is found, return 404
                data: null,
            });
        }

        // Return the course details in the response
        res.status(200).json({
            success: true,
            data: courseDetails, // Return the found course data
        });
    } catch (e) {
        console.log(e); // Log errors for debugging
        res.status(500).json({
            success: false,
            message: "Some error occured!", // Return a generic error message if something goes wrong
        });
    }
};

// Controller to check if a student has already purchased a course
const checkCoursePurchaseInfo = async (req, res) => {
    try {
        const { id, studentId } = req.params; // Get course ID and student ID from the request parameters
        const studentCourses = await StudentCourses.findOne({
            userId: studentId, // Search for the student's course list
        });

        if (!studentCourses || !studentCourses.courses) {
            return res.status(200).json({
                success: true,
                data: false, // Student hasn't bought any courses
            });
        }

        // Check if the student has already purchased the specific course
        const ifStudentAlreadyBoughtCurrentCourse =
            studentCourses.courses.findIndex((item) => item.courseId === id) > -1;

        // Return whether the student has already purchased the course
        res.status(200).json({
            success: true,
            data: ifStudentAlreadyBoughtCurrentCourse, // Return true/false
        });
    } catch (e) {
        console.log(e); // Log errors for debugging
        res.status(500).json({
            success: false,
            message: "Some error occurred!", // Return a generic error message in case of failure
        });
    }
};

// Exporting the controllers to be used in routes
module.exports = {
    getAllStudentViewCourses,
    getStudentViewCourseDetails,
    checkCoursePurchaseInfo,
};
