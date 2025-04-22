import MediaProgressbar from "@/components/media-progress-bar"; // Import media progress bar to show upload progress
import { Button } from "@/components/ui/button"; // Import Button component for actions like adding lectures or uploading files
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components for layout
import { Input } from "@/components/ui/input"; // Import Input component for text and file inputs
import { Label } from "@/components/ui/label"; // Import Label component for labeling inputs
import { Switch } from "@/components/ui/switch"; // Import Switch component for toggling "Free Preview" option
import VideoPlayer from "@/components/video-player"; // Import VideoPlayer component to display video
import { courseCurriculumInitialFormData } from "@/config"; // Import initial form data configuration for course curriculum
import { InstructorContext } from "@/context/instructor-context"; // Import InstructorContext to access the context
import {
    mediaBulkUploadService,
    mediaDeleteService,
    mediaUploadService,
} from "@/services"; // Import services to handle media upload, delete, and bulk upload
import { Upload } from "lucide-react"; // Import icon for bulk upload
import { useContext, useRef } from "react"; // Import hooks for context and references

// CourseCurriculum component renders the form for managing the course curriculum
function CourseCurriculum() {
    const {
        courseCurriculumFormData, // Access the current course curriculum form data
        setCourseCurriculumFormData, // Function to update the course curriculum form data
        mediaUploadProgress, // Track the upload progress of media files
        setMediaUploadProgress, // Function to update media upload progress
        mediaUploadProgressPercentage, // Track the percentage of media uploaded
        setMediaUploadProgressPercentage, // Function to set upload percentage
    } = useContext(InstructorContext); // Use context to get and set instructor-related data

    const bulkUploadInputRef = useRef(null); // Reference to trigger the bulk upload file input

    // Handle adding a new lecture to the course curriculum
    function handleNewLecture() {
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            {
                ...courseCurriculumInitialFormData[0], // Default initial data for a new lecture
            },
        ]);
    }

    // Handle changing the title of a specific lecture
    function handleCourseTitleChange(event, currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            title: event.target.value, // Update the title for the specific lecture
        };

        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    // Handle changing the "free preview" setting for a lecture
    function handleFreePreviewChange(currentValue, currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            freePreview: currentValue, // Set the free preview value
        };

        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    // Handle single lecture file upload
    async function handleSingleLectureUpload(event, currentIndex) {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const videoFormData = new FormData();
            videoFormData.append("file", selectedFile);

            try {
                setMediaUploadProgress(true); // Start the media upload process
                const response = await mediaUploadService(
                    videoFormData,
                    setMediaUploadProgressPercentage // Update progress percentage during upload
                );
                if (response.success) {
                    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
                    cpyCourseCurriculumFormData[currentIndex] = {
                        ...cpyCourseCurriculumFormData[currentIndex],
                        videoUrl: response?.data?.url, // Set the video URL after successful upload
                        public_id: response?.data?.public_id, // Set the public ID for the video
                    };
                    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
                    setMediaUploadProgress(false); // Stop the upload progress indicator
                }
            } catch (error) {
                console.log(error); // Handle any errors during the upload process
            }
        }
    }

    // Handle replacing the video for a lecture
    async function handleReplaceVideo(currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const getCurrentVideoPublicId =
            cpyCourseCurriculumFormData[currentIndex].public_id;

        const deleteCurrentMediaResponse = await mediaDeleteService(
            getCurrentVideoPublicId // Delete the existing video using the public ID
        );

        if (deleteCurrentMediaResponse?.success) {
            cpyCourseCurriculumFormData[currentIndex] = {
                ...cpyCourseCurriculumFormData[currentIndex],
                videoUrl: "", // Clear the old video URL
                public_id: "", // Clear the old public ID
            };

            setCourseCurriculumFormData(cpyCourseCurriculumFormData); // Update the form data
        }
    }

    // Validate if all course curriculum data (title and video) is filled
    function isCourseCurriculumFormDataValid() {
        return courseCurriculumFormData.every((item) => {
            return (
                item &&
                typeof item === "object" &&
                item.title.trim() !== "" && // Check if title is not empty
                item.videoUrl.trim() !== "" // Check if video URL is not empty
            );
        });
    }

    // Handle opening the bulk upload dialog
    function handleOpenBulkUploadDialog() {
        bulkUploadInputRef.current?.click(); // Trigger the file input click
    }

    // Check if all curriculum form data objects are empty
    function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
        return arr.every((obj) => {
            return Object.entries(obj).every(([key, value]) => {
                if (typeof value === "boolean") {
                    return true; // Skip boolean values (like "freePreview")
                }
                return value === ""; // Check if the value is empty
            });
        });
    }

    // Handle bulk media file upload
    async function handleMediaBulkUpload(event) {
        const selectedFiles = Array.from(event.target.files); // Convert file list to array
        const bulkFormData = new FormData();

        selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem)); // Add files to FormData

        try {
            setMediaUploadProgress(true); // Start upload progress
            const response = await mediaBulkUploadService(
                bulkFormData,
                setMediaUploadProgressPercentage // Update progress percentage during bulk upload
            );

            if (response?.success) {
                let cpyCourseCurriculumFormdata =
                    areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
                        ? []
                        : [...courseCurriculumFormData];

                cpyCourseCurriculumFormdata = [
                    ...cpyCourseCurriculumFormdata,
                    ...response?.data.map((item, index) => ({
                        videoUrl: item?.url, // Set the video URL from the upload response
                        public_id: item?.public_id, // Set the public ID from the upload response
                        title: `Lecture ${cpyCourseCurriculumFormdata.length + (index + 1)}`, // Generate default title
                        freePreview: false, // Default free preview setting
                    })),
                ];
                setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
                setMediaUploadProgress(false); // Stop upload progress
            }
        } catch (e) {
            console.log(e); // Handle errors during bulk upload
        }
    }

    // Handle deleting a specific lecture
    async function handleDeleteLecture(currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];

        const getCurrentSelectedVideoPublicId =
            cpyCourseCurriculumFormData[currentIndex].public_id;

        const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

        if (response?.success) {
            cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
                (_, index) => index !== currentIndex // Remove the selected lecture from the list
            );

            setCourseCurriculumFormData(cpyCourseCurriculumFormData); // Update the curriculum data
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle>Create Course Curriculum</CardTitle>
                <div>
                    <Input
                        type="file"
                        ref={bulkUploadInputRef}
                        accept="video/*"
                        multiple
                        className="hidden"
                        id="bulk-media-upload"
                        onChange={handleMediaBulkUpload} // Handle bulk file upload
                    />
                    <Button
                        as="label"
                        htmlFor="bulk-media-upload"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={handleOpenBulkUploadDialog} // Open bulk upload dialog
                    >
                        <Upload className="w-4 h-5 mr-2" />
                        Bulk Upload
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Button
                    disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
                    onClick={handleNewLecture} // Add a new lecture to the curriculum
                >
                    Add Lecture
                </Button>
                {mediaUploadProgress ? (
                    <MediaProgressbar
                        isMediaUploading={mediaUploadProgress}
                        progress={mediaUploadProgressPercentage}
                    />
                ) : null}
                <div className="mt-4 space-y-4">
                    {courseCurriculumFormData.map((curriculumItem, index) => (
                        <div className="border p-5 rounded-md" key={index}>
                            <div className="flex gap-5 items-center">
                                <h3 className="font-semibold">Lecture {index + 1}</h3>
                                <Input
                                    name={`title-${index + 1}`}
                                    placeholder="Enter lecture title"
                                    className="max-w-96"
                                    onChange={(event) => handleCourseTitleChange(event, index)}
                                    value={courseCurriculumFormData[index]?.title}
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        onCheckedChange={(value) =>
                                            handleFreePreviewChange(value, index)
                                        }
                                        checked={courseCurriculumFormData[index]?.freePreview}
                                        id={`freePreview-${index + 1}`}
                                    />
                                    <Label htmlFor={`freePreview-${index + 1}`}>
                                        Free Preview
                                    </Label>
                                </div>
                            </div>
                            <div className="mt-6">
                                {courseCurriculumFormData[index]?.videoUrl ? (
                                    <div className="flex gap-3">
                                        <VideoPlayer
                                            url={courseCurriculumFormData[index]?.videoUrl}
                                            width="450px"
                                            height="200px"
                                        />
                                        <Button onClick={() => handleReplaceVideo(index)}>
                                            Replace Video
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteLecture(index)}
                                            className="bg-red-900"
                                        >
                                            Delete Lecture
                                        </Button>
                                    </div>
                                ) : (
                                    <Input
                                        type="file"
                                        accept="video/*"
                                        onChange={(event) =>
                                            handleSingleLectureUpload(event, index)
                                        }
                                        className="mb-4"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default CourseCurriculum;
