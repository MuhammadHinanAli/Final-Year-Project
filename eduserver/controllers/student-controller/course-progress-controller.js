const CourseProgress = require("../../models/CourseProgress");  // Import CourseProgress model
const Course = require("../../models/Course");  // Import Course model
const StudentCourses = require("../../models/StudentCourses");  // Import StudentCourses model

// Mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
    try {
        // Destructure data from the request body
        const { userId, courseId, lectureId } = req.body;

        // Check if the user already has a progress record for the course
        let progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress) {
            // If no progress record exists, create a new one
            progress = new CourseProgress({
                userId,
                courseId,
                lecturesProgress: [
                    {
                        lectureId,
                        viewed: true,
                        dateViewed: new Date(), // Set the current date when the lecture is viewed
                    },
                ],
            });
            await progress.save();  // Save the progress record to the database
        } else {
            // If progress exists, find the specific lecture progress
            const lectureProgress = progress.lecturesProgress.find(
                (item) => item.lectureId === lectureId
            );

            if (lectureProgress) {
                // If lecture progress exists, mark it as viewed
                lectureProgress.viewed = true;
                lectureProgress.dateViewed = new Date();
            } else {
                // If lecture progress doesn't exist, add a new entry
                progress.lecturesProgress.push({
                    lectureId,
                    viewed: true,
                    dateViewed: new Date(),
                });
            }
            await progress.save();  // Save the updated progress record
        }

        // Retrieve the course details
        const course = await Course.findById(courseId);

        if (!course) {
            // If the course doesn't exist, return an error
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Check if all lectures have been viewed by comparing the progress with the curriculum
        const allLecturesViewed =
            progress.lecturesProgress.length === course.curriculum.length &&
            progress.lecturesProgress.every((item) => item.viewed);

        if (allLecturesViewed) {
            // If all lectures are viewed, mark the course as completed
            progress.completed = true;
            progress.completionDate = new Date();  // Set completion date

            await progress.save();  // Save the updated progress record
        }

        // Send a success response with the updated progress data
        res.status(200).json({
            success: true,
            message: "Lecture marked as viewed",
            data: progress,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

// Get current course progress
const getCurrentCourseProgress = async (req, res) => {
    try {
        // Extract userId and courseId from request parameters
        const { userId, courseId } = req.params;

        // Check if the user has purchased the course
        const studentPurchasedCourses = await StudentCourses.findOne({ userId });
        const isCurrentCoursePurchasedByCurrentUserOrNot =
            studentPurchasedCourses?.courses?.findIndex(
                (item) => item.courseId === courseId
            ) > -1;

        if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
            // If the user has not purchased the course, return a message
            return res.status(200).json({
                success: true,
                data: {
                    isPurchased: false,
                },
                message: "You need to purchase this course to access it.",
            });
        }

        // Retrieve the user's course progress for the given course
        const currentUserCourseProgress = await CourseProgress.findOne({
            userId,
            courseId,
        });

        if (
            !currentUserCourseProgress ||
            currentUserCourseProgress?.lecturesProgress?.length === 0
        ) {
            // If no progress exists, return a message with course details
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "No progress found, you can start watching the course",
                data: {
                    courseDetails: course,
                    progress: [],
                    isPurchased: true,
                },
            });
        }

        // If progress exists, return course details and progress
        const courseDetails = await Course.findById(courseId);

        res.status(200).json({
            success: true,
            data: {
                courseDetails,
                progress: currentUserCourseProgress.lecturesProgress,
                completed: currentUserCourseProgress.completed,
                completionDate: currentUserCourseProgress.completionDate,
                isPurchased: true,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

// Reset course progress
const resetCurrentCourseProgress = async (req, res) => {
    try {
        // Destructure userId and courseId from the request body
        const { userId, courseId } = req.body;

        // Find the progress record for the user and course
        const progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress) {
            // If progress is not found, return an error message
            return res.status(404).json({
                success: false,
                message: "Progress not found!",
            });
        }

        // Reset the progress details
        progress.lecturesProgress = [];
        progress.completed = false;
        progress.completionDate = null;

        await progress.save();  // Save the reset progress record

        // Send a success response with the updated progress
        res.status(200).json({
            success: true,
            message: "Course progress has been reset",
            data: progress,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

module.exports = {
    markCurrentLectureAsViewed,
    getCurrentCourseProgress,
    resetCurrentCourseProgress,
};
