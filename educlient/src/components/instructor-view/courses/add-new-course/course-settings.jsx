import MediaProgressbar from "@/components/media-progress-bar"; // Import progress bar component for media uploads
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import card layout components
import { Input } from "@/components/ui/input"; // Import input component for file upload
import { Label } from "@/components/ui/label"; // Import label component for form fields
import { InstructorContext } from "@/context/instructor-context"; // Import context to access instructor-related data
import { mediaUploadService } from "@/services"; // Import service for handling media upload
import { useContext } from "react"; // Import React hook to use context

// CourseSettings component allows an instructor to upload a course image and view upload progress
function CourseSettings() {
    // Access relevant form data and setters from InstructorContext
    const {
        courseLandingFormData, // Form data for the course landing page
        setCourseLandingFormData, // Setter function for the course landing form data
        mediaUploadProgress, // Indicates if media upload is in progress
        setMediaUploadProgress, // Setter function to update upload progress status
        mediaUploadProgressPercentage, // Current percentage of upload progress
        setMediaUploadProgressPercentage, // Setter function to update upload progress percentage
    } = useContext(InstructorContext);

    // Function to handle image upload
    async function handleImageUploadChange(event) {
        const selectedImage = event.target.files[0]; // Get the selected image file

        if (selectedImage) {
            const imageFormData = new FormData();
            imageFormData.append("file", selectedImage); // Append the image to the FormData object

            try {
                setMediaUploadProgress(true); // Set upload progress to true
                const response = await mediaUploadService( // Call media upload service
                    imageFormData,
                    setMediaUploadProgressPercentage // Pass progress percentage handler
                );
                if (response.success) {
                    // Update course landing form data with the uploaded image URL
                    setCourseLandingFormData({
                        ...courseLandingFormData,
                        image: response.data.url,
                    });
                    setMediaUploadProgress(false); // Reset upload progress status
                }
            } catch (e) {
                console.log(e); // Log any errors encountered during the upload
            }
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Settings</CardTitle> {/* Card header with title */}
            </CardHeader>
            <div className="p-4">
                {/* Show progress bar if media upload is in progress */}
                {mediaUploadProgress ? (
                    <MediaProgressbar
                        isMediaUploading={mediaUploadProgress}
                        progress={mediaUploadProgressPercentage}
                    />
                ) : null}
            </div>
            <CardContent>
                {/* If the course already has an image, display it */}
                {courseLandingFormData?.image ? (
                    <img src={courseLandingFormData.image} /> // Show the uploaded course image
                ) : (
                    // Otherwise, display the file input for image upload
                    <div className="flex flex-col gap-3">
                        <Label>Upload Course Image</Label> {/* Label for the input */}
                        <Input
                            onChange={handleImageUploadChange} // Handle image upload when file is selected
                            type="file"
                            accept="image/*" // Accept only image files
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default CourseSettings; // Export the component for use elsewhere
