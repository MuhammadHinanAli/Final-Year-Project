const StudentCourses = require("../../models/StudentCourses");  // Import the StudentCourses model

// Get all courses bought by a specific student using their studentId
const getCoursesByStudentId = async (req, res) => {
    try {
        // Extract studentId from request parameters
        const { studentId } = req.params;

        // Find the student's course records using their studentId
        const studentBoughtCourses = await StudentCourses.findOne({
            userId: studentId,  // Match the userId to the studentId
        });

        // If courses are found, return the list of courses
        res.status(200).json({
            success: true,
            data: studentBoughtCourses.courses,  // Return the courses the student has purchased
        });
    } catch (error) {
        console.log(error);  // Log any errors that occur during the process
        res.status(500).json({
            success: false,
            message: "Some error occurred!",  // Generic error message if something goes wrong
        });
    }
};

module.exports = { getCoursesByStudentId };  // Export the function to be used in other parts of the application
