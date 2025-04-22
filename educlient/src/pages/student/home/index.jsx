import { courseCategories } from "@/config"; // Import course categories configuration
import banner from "../../../../public/banner-img.png"; // Import banner image
import { Button } from "@/components/ui/button"; // Import the Button component
import { useContext, useEffect } from "react"; // Import React hooks
import { StudentContext } from "@/context/student-context"; // Import student context for state management
import {
    checkCoursePurchaseInfoService,
    fetchStudentViewCourseListService,
} from "@/services"; // Import services for fetching courses and checking purchase info
import { AuthContext } from "@/context/auth-context"; // Import authentication context
import { useNavigate } from "react-router-dom"; // Import navigation hook for routing

function StudentHomePage() {
    // Retrieve student view course list and setter from the StudentContext
    const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
    // Retrieve auth context to access logged-in user information
    const { auth } = useContext(AuthContext);
    // Set up navigation using the useNavigate hook
    const navigate = useNavigate();

    // Function to navigate to the course page with the selected category filter
    function handleNavigateToCoursesPage(getCurrentId) {
        console.log(getCurrentId); // Log category ID for debugging
        sessionStorage.removeItem("filters"); // Remove any previous filters from sessionStorage
        const currentFilter = {
            category: [getCurrentId], // Set the current category filter
        };

        // Store the current filter in sessionStorage
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));

        // Navigate to the courses page
        navigate("/courses");
    }

    // Function to fetch all courses available for the student
    async function fetchAllStudentViewCourses() {
        const response = await fetchStudentViewCourseListService(); // Call service to fetch courses
        if (response?.success) setStudentViewCoursesList(response?.data); // If successful, set course list in state
    }

    // Function to handle navigation to a specific course (either details or progress)
    async function handleCourseNavigate(getCurrentCourseId) {
        const response = await checkCoursePurchaseInfoService(
            getCurrentCourseId,
            auth?.user?._id // Check if the user has purchased the course
        );

        if (response?.success) {
            if (response?.data) {
                // If the user has purchased the course, navigate to course progress
                navigate(`/course-progress/${getCurrentCourseId}`);
            } else {
                // Otherwise, navigate to course details
                navigate(`/course/details/${getCurrentCourseId}`);
            }
        }
    }

    // Fetch student view courses when the component mounts
    useEffect(() => {
        fetchAllStudentViewCourses();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Banner Section */}
            <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
                <div className="lg:w-1/2 lg:pr-12">
                    <h1 className="text-3xl font-bold mb-4">"Education is the most powerful weapon which you can use to change the world." ~ Nelson Mandela</h1>
                    <p className="text-xl">
                        Welcome to EduQuest, the ultimate online learning platform designed to empower students and educators. Whether you're looking to enhance your skills, access interactive courses, or manage educational resources efficiently, our LMS provides a seamless and engaging learning experience. With intuitive navigation, real-time progress tracking, and a vast library of courses, we make education accessible anytime, anywhere. Join us today and take the next step in your learning journey!
                    </p>
                </div>
                <div className="lg:w-full mb-8 lg:mb-0">
                    <img
                        src={banner}
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            </section>

            {/* Course Categories Section */}
            <section className="py-8 px-4 lg:px-8 bg-gray-100">
                <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {courseCategories.map((categoryItem) => (
                        // Create a button for each category that navigates to the courses page with the selected category filter
                        <Button
                            className="justify-start"
                            variant="outline"
                            key={categoryItem.id}
                            onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
                        >
                            {categoryItem.label}
                        </Button>
                    ))}
                </div>
            </section>

            {/* Featured Courses Section */}
            <section className="py-12 px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Check if there are any courses to display */}
                    {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                        studentViewCoursesList.map((courseItem) => (
                            // Render each course item with its image, title, instructor name, and pricing
                            <div
                                onClick={() => handleCourseNavigate(courseItem?._id)}
                                className="border rounded-lg overflow-hidden shadow cursor-pointer"
                            >
                                <img
                                    src={courseItem?.image}
                                    width={300}
                                    height={150}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                                    <p className="text-sm text-gray-700 mb-2">
                                        {courseItem?.instructorName}
                                    </p>
                                    <p className="font-bold text-[16px]">
                                        ${courseItem?.pricing}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        // If no courses are found, display a message
                        <h1>No Courses Found</h1>
                    )}
                </div>
            </section>
        </div>
    );
}

export default StudentHomePage;
