// Import Button component for UI actions like creating, editing, deleting courses
import { Button } from "@/components/ui/button";

// Import Card layout components to create structured card UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import table components to display course information in a tabular format
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Import initial form data for course landing and curriculum sections
import {
    courseCurriculumInitialFormData,
    courseLandingInitialFormData,
} from "@/config";

// Import context for instructor-specific state management
import { InstructorContext } from "@/context/instructor-context";

// Import icons for edit and delete actions
import { Delete, Edit } from "lucide-react";

// Import hooks for context and routing
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Import course delete service to call the backend API
import { deleteCourseByIdService } from "@/services";

// Component to display and manage a list of instructor courses
function InstructorCourses({ listOfCourses }) {
    const navigate = useNavigate(); // Hook to navigate programmatically between pages

    // Destructure state management functions from context
    const {
        setCurrentEditedCourseId,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
    } = useContext(InstructorContext);

    // Function to handle course deletion
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            await deleteCourseByIdService(id); // Call API to delete the course
            alert("Course deleted successfully!"); // Show success message
            window.location.reload(); // Refresh the page to update course list
        } catch (error) {
            console.error("Error deleting course:", error); // Log the error
            alert("Something went wrong while deleting the course."); // Show error message
        }
    };

    return (
        <Card>
            {/* Header of the card, includes title and create new course button */}
            <CardHeader className="flex justify-between flex-row items-center">
                <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>

                {/* Button to create a new course */}
                <Button
                    onClick={() => {
                        setCurrentEditedCourseId(null); // Reset editing ID
                        setCourseLandingFormData(courseLandingInitialFormData); // Reset form data
                        setCourseCurriculumFormData(courseCurriculumInitialFormData);
                        navigate("/instructor/create-new-course"); // Go to course creation page
                    }}
                    className="p-6"
                >
                    Create New Course
                </Button>
            </CardHeader>

            {/* Main content area where the course list is displayed */}
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        {/* Table header row */}
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* Table body with course rows */}
                        <TableBody>
                            {listOfCourses && listOfCourses.length > 0
                                ? listOfCourses.map((course) => (
                                    <TableRow key={course._id}>
                                        {/* Course title */}
                                        <TableCell className="font-medium">
                                            {course?.title}
                                        </TableCell>

                                        {/* Number of enrolled students */}
                                        <TableCell>{course?.students?.length}</TableCell>

                                        {/* Calculated revenue based on student count and pricing */}
                                        <TableCell>
                                            €{course?.students?.length * course?.pricing}
                                        </TableCell>

                                        {/* Action buttons for edit and delete */}
                                        <TableCell className="text-right">
                                            {/* Edit button */}
                                            <Button
                                                onClick={() => {
                                                    navigate(`/instructor/edit-course/${course?._id}`);
                                                }}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Edit className="h-6 w-6" />
                                            </Button>

                                            {/* Delete button */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(course._id)}
                                            >
                                                <Delete className="h-6 w-6" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : null /* Display nothing if no courses are found */}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

// Export the InstructorCourses component to be used elsewhere
export default InstructorCourses;
