import { Button } from "@/components/ui/button"; // Import the Button component for user actions
import { Card, CardContent, CardFooter } from "@/components/ui/card"; // Import Card components for displaying courses
import { AuthContext } from "@/context/auth-context"; // Import the authentication context for user-related data
import { StudentContext } from "@/context/student-context"; // Import the student context for managing student-related data
import { fetchStudentBoughtCoursesService } from "@/services"; // Import the service function to fetch student's bought courses
import { Watch } from "lucide-react"; // Import the Watch icon from lucide-react for the button
import { useContext, useEffect } from "react"; // Import React hooks
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for navigation

function StudentCoursesPage() {
    // Use context to get authentication data (user) and student's bought courses list
    const { auth } = useContext(AuthContext);
    const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(StudentContext);
    const navigate = useNavigate(); // Hook to navigate between pages

    // Function to fetch the list of courses the student has bought
    async function fetchStudentBoughtCourses() {
        // Call the service to get the bought courses of the logged-in student
        const response = await fetchStudentBoughtCoursesService(auth?.user?._id);

        // If the response is successful, set the bought courses list in the context
        if (response?.success) {
            setStudentBoughtCoursesList(response?.data);
        }
        console.log(response); // Log the response for debugging purposes
    }

    // UseEffect hook to fetch the bought courses when the component mounts
    useEffect(() => {
        fetchStudentBoughtCourses();
    }, []); // Empty dependency array means this effect runs only once, when the component mounts

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-8">My Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {/* If the student has bought courses, display them */}
                {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
                    studentBoughtCoursesList.map((course) => (
                        <Card key={course.id} className="flex flex-col">
                            <CardContent className="p-4 flex-grow">
                                {/* Display course image, title, and instructor */}
                                <img
                                    src={course?.courseImage}
                                    alt={course?.title}
                                    className="h-52 w-full object-cover rounded-md mb-4"
                                />
                                <h3 className="font-bold mb-1">{course?.title}</h3>
                                <p className="text-sm text-gray-700 mb-2">
                                    Created By: {course?.instructorName}
                                </p>
                            </CardContent>
                            <CardFooter>
                                {/* Button to start watching the course */}
                                <Button
                                    onClick={() =>
                                        navigate(`/course-progress/${course?.courseId}`)
                                    }
                                    className="flex-1"
                                >
                                    <Watch className="mr-2 h-4 w-4" /> {/* Icon for the button */}
                                    Start Watching
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    // If no courses are found, display a message
                    <h1 className="text-3xl font-bold">No Courses found</h1>
                )}
            </div>
        </div>
    );
}

export default StudentCoursesPage; // Export the component for use elsewhere
