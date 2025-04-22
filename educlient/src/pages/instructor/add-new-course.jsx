// Importing necessary components and hooks
import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum"; // Course curriculum component
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing"; // Course landing page component
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings"; // Course settings component
import { Button } from "@/components/ui/button"; // Button UI component
import { Card, CardContent } from "@/components/ui/card"; // Card UI components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Tabs UI components
import {
    courseCurriculumInitialFormData,
    courseLandingInitialFormData,
} from "@/config"; // Initial form data for course curriculum and landing page
import { AuthContext } from "@/context/auth-context"; // Authentication context for user data
import { InstructorContext } from "@/context/instructor-context"; // Instructor context for course data
import {
    addNewCourseService,
    fetchInstructorCourseDetailsService,
    updateCourseByIdService,
} from "@/services"; // Services for creating and updating courses
import { useContext, useEffect } from "react"; // React hooks for managing state and lifecycle
import { useNavigate, useParams } from "react-router-dom"; // React Router hooks for navigation and route params

function AddNewCoursePage() {
    // Using context to get and set course-related form data and other state values
    const {
        courseLandingFormData,
        courseCurriculumFormData,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        currentEditedCourseId,
        setCurrentEditedCourseId,
    } = useContext(InstructorContext);

    // Accessing auth data from AuthContext
    const { auth } = useContext(AuthContext);

    // Initializing hooks for navigation and route parameters
    const navigate = useNavigate();
    const params = useParams();

    // Helper function to check if a value is empty (useful for form validation)
    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        return value === "" || value === null || value === undefined;
    }

    // Function to validate the form data before submission
    function validateFormData() {
        // Check if all required fields in the course landing form are filled
        for (const key in courseLandingFormData) {
            if (isEmpty(courseLandingFormData[key])) {
                return false;
            }
        }

        let hasFreePreview = false;

        // Check if all curriculum items are valid and if there is at least one free preview
        for (const item of courseCurriculumFormData) {
            if (
                isEmpty(item.title) ||
                isEmpty(item.videoUrl) ||
                isEmpty(item.public_id)
            ) {
                return false;
            }

            if (item.freePreview) {
                hasFreePreview = true; //found at least one free preview
            }
        }

        return hasFreePreview;
    }

    // Function to handle course creation or update
    async function handleCreateCourse() {
        const courseFinalFormData = {
            instructorId: auth?.user?._id,
            instructorName: auth?.user?.userName,
            date: new Date(),
            ...courseLandingFormData,
            students: [],
            curriculum: courseCurriculumFormData,
            isPublised: true,
        };

        // Decide whether to add a new course or update an existing one based on the course ID
        const response =
            currentEditedCourseId !== null
                ? await updateCourseByIdService(
                    currentEditedCourseId,
                    courseFinalFormData
                )
                : await addNewCourseService(courseFinalFormData);

        if (response?.success) {
            // Reset the form data and navigate back to the previous page on success
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate(-1); // Go back to the previous page
            setCurrentEditedCourseId(null); // Clear the edited course ID
        }

        console.log(courseFinalFormData, "courseFinalFormData"); // Log course data for debugging
    }

    // Function to fetch existing course details if we are editing an existing course
    async function fetchCurrentCourseDetails() {
        const response = await fetchInstructorCourseDetailsService(
            currentEditedCourseId
        );

        if (response?.success) {
            const setCourseFormData = Object.keys(
                courseLandingInitialFormData
            ).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key];
                return acc;
            }, {});

            console.log(setCourseFormData, response?.data, "setCourseFormData");
            setCourseLandingFormData(setCourseFormData); // Set form data for course landing
            setCourseCurriculumFormData(response?.data?.curriculum); // Set form data for curriculum
        }

        console.log(response, "response"); // Log the response for debugging
    }

    // useEffect to fetch course details if editing an existing course
    useEffect(() => {
        if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
    }, [currentEditedCourseId]);

    // useEffect to set the course ID from the route params when editing an existing course
    useEffect(() => {
        if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
    }, [params?.courseId]);

    console.log(params, currentEditedCourseId, "params"); // Log the route params and current course ID for debugging

    return (
        <div className="container mx-auto p-4">
            {/* Page header with title and submit button */}
            <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
                <Button
                    disabled={!validateFormData()} // Disable submit button if form is not valid
                    className="text-sm tracking-wider font-bold px-8"
                    onClick={handleCreateCourse} // Trigger course creation or update
                >
                    SUBMIT
                </Button>
            </div>

            {/* Card container for course creation form */}
            <Card>
                <CardContent>
                    <div className="container mx-auto p-4">
                        {/* Tabs for different sections of the course creation process */}
                        <Tabs defaultValue="curriculum" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                                <TabsTrigger value="course-landing-page">
                                    Course Landing Page
                                </TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
                            <TabsContent value="curriculum">
                                <CourseCurriculum /> {/* Curriculum section */}
                            </TabsContent>
                            <TabsContent value="course-landing-page">
                                <CourseLanding /> {/* Course landing page section */}
                            </TabsContent>
                            <TabsContent value="settings">
                                <CourseSettings /> {/* Settings section */}
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AddNewCoursePage;
