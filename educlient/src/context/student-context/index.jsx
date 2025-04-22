// Importing React utilities
import { createContext, useState } from "react";

// Creating a context to manage student-related state throughout the app
export const StudentContext = createContext(null);

// Provider component that supplies student-related state to its children
export default function StudentProvider({ children }) {
    // List of all courses visible to the student (e.g., available for enrollment)
    const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);

    // Boolean to track loading state (e.g., while fetching data)
    const [loadingState, setLoadingState] = useState(true);

    // Details of a specific course the student is currently viewing
    const [studentViewCourseDetails, setStudentViewCourseDetails] =
        useState(null);

    // ID of the course currently being viewed in detail
    const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);

    // List of courses the student has purchased/enrolled in
    const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);

    // Object tracking the progress of the current course the student is taking
    const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
        useState({});

    return (
        // Providing all student-related state and setters to the component tree
        <StudentContext.Provider
            value={{
                studentViewCoursesList,
                setStudentViewCoursesList,
                loadingState,
                setLoadingState,
                studentViewCourseDetails,
                setStudentViewCourseDetails,
                currentCourseDetailsId,
                setCurrentCourseDetailsId,
                studentBoughtCoursesList,
                setStudentBoughtCoursesList,
                studentCurrentCourseProgress,
                setStudentCurrentCourseProgress,
            }}
        >
            {/* Render child components within the student context */}
            {children}
        </StudentContext.Provider>
    );
}
