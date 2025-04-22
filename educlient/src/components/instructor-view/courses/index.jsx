import { Button } from "@/components/ui/button"; // Import the Button component for actions like creating or editing courses
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import components for card layout and content
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Import components for rendering tables
import {
    courseCurriculumInitialFormData,
    courseLandingInitialFormData,
} from "@/config"; // Import initial form data configurations for courses
import { InstructorContext } from "@/context/instructor-context"; // Import InstructorContext for accessing instructor-specific data
import { Delete, Edit } from "lucide-react"; // Import icons for editing and deleting
import { useContext } from "react"; // Import useContext to access context data
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation to different pages

// InstructorCourses component renders a list of courses with options to edit or delete
function InstructorCourses({ listOfCourses }) {
    const navigate = useNavigate(); // Hook for navigation between pages
    const {
        setCurrentEditedCourseId, // Function to set the ID of the course being edited
        setCourseLandingFormData, // Function to set the initial form data for course landing
        setCourseCurriculumFormData, // Function to set the initial form data for course curriculum
    } = useContext(InstructorContext); // Access the instructor context to manage course data

    return (
        <Card>
            <CardHeader className="flex justify-between flex-row items-center">
                {/* Title of the section */}
                <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>

                {/* Button to create a new course */}
                <Button
                    onClick={() => {
                        // Reset the form data for new course creation
                        setCurrentEditedCourseId(null); // No course is being edited
                        setCourseLandingFormData(courseLandingInitialFormData); // Set default landing form data
                        setCourseCurriculumFormData(courseCurriculumInitialFormData); // Set default curriculum form data

                        // Navigate to the new course creation page
                        navigate("/instructor/create-new-course");
                    }}
                    className="p-6"
                >
                    Create New Course
                </Button>
            </CardHeader>
            <CardContent>
                {/* Table displaying list of courses */}
                <div className="overflow-x-auto">
                    <Table>
                        {/* Table header with column names */}
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* Table body with courses data */}
                        <TableBody>
                            {listOfCourses && listOfCourses.length > 0
                                ? listOfCourses.map((course) => (
                                    <TableRow key={course._id}> {/* Unique key for each row */}
                                        <TableCell className="font-medium">
                                            {course?.title} {/* Display the course title */}
                                        </TableCell>
                                        <TableCell>{course?.students?.length}</TableCell> {/* Display the number of students enrolled */}
                                        <TableCell>
                                            €{course?.students?.length * course?.pricing} {/* Calculate and display revenue */}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {/* Button to edit the course */}
                                            <Button
                                                onClick={() => {
                                                    // Navigate to the edit page for the selected course
                                                    navigate(`/instructor/edit-course/${course?._id}`);
                                                }}
                                                variant="ghost" // Ghost variant for a minimal button style
                                                size="sm"
                                            >
                                                <Edit className="h-6 w-6" /> {/* Edit icon */}
                                            </Button>

                                            {/* Button to delete the course (currently no functionality attached) */}
                                            <Button variant="ghost" size="sm">
                                                <Delete className="h-6 w-6" /> {/* Delete icon */}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : null} {/* If no courses, nothing is displayed */}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

export default InstructorCourses; // Export the InstructorCourses component for use in other parts of the application
