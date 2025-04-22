import FormControls from "@/components/common-form/form-controls"; // Import FormControls component to render form inputs
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import UI components for the card layout
import { courseLandingPageFormControls } from "@/config"; // Import form configuration for course landing page
import { InstructorContext } from "@/context/instructor-context"; // Import context to access instructor-related data
import { useContext } from "react"; // Import React hook to use context

// CourseLanding component renders the landing page form for the course
function CourseLanding() {
    // Access course landing form data and setter function from InstructorContext
    const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);

    return (
        <Card> {/* Card component to wrap the landing page content */}
            <CardHeader>
                <CardTitle>Course Landing Page</CardTitle> {/* Header with title */}
            </CardHeader>
            <CardContent>
                {/* FormControls component is responsible for rendering the form inputs based on the configuration */}
                <FormControls
                    formControls={courseLandingPageFormControls} // Form configuration for the landing page
                    formData={courseLandingFormData} // Current form data for the landing page
                    setFormData={setCourseLandingFormData} // Setter function to update form data
                />
            </CardContent>
        </Card>
    );
}

export default CourseLanding; // Export the component for use in other parts of the app
