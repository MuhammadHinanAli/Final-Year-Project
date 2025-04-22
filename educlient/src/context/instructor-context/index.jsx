// Importing initial form data defaults for course landing and curriculum
import {
    courseCurriculumInitialFormData,
    courseLandingInitialFormData,
} from "@/config";

// Importing React utilities
import { createContext, useState } from "react";

// Creating a context to share instructor-related state across components
export const InstructorContext = createContext(null);

// Provider component that wraps children and provides instructor context values
export default function InstructorProvider({ children }) {
    // State to hold and update the course landing page form data
    const [courseLandingFormData, setCourseLandingFormData] = useState(
        courseLandingInitialFormData
    );

    // State to hold and update the course curriculum form data
    const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
        courseCurriculumInitialFormData
    );

    // State to manage whether media upload is in progress
    const [mediaUploadProgress, setMediaUploadProgress] = useState(false);

    // State to track media upload progress percentage
    const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
        useState(0);

    // State to store the list of courses created by the instructor
    const [instructorCoursesList, setInstructorCoursesList] = useState([]);

    // State to store the currently edited course's ID
    const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

    return (
        // Providing all instructor-related states and their setters to context consumers
        <InstructorContext.Provider
            value={{
                courseLandingFormData,
                setCourseLandingFormData,
                courseCurriculumFormData,
                setCourseCurriculumFormData,
                mediaUploadProgress,
                setMediaUploadProgress,
                mediaUploadProgressPercentage,
                setMediaUploadProgressPercentage,
                instructorCoursesList,
                setInstructorCoursesList,
                currentEditedCourseId,
                setCurrentEditedCourseId,
            }}
        >
            {/* Render the child components within the context */}
            {children}
        </InstructorContext.Provider>
    );
}
