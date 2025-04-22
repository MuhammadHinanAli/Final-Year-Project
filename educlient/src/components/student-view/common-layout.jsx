import { Outlet, useLocation } from "react-router-dom";  // Import necessary components from react-router-dom
import StudentViewCommonHeader from "./header";  // Import the common header component for the student view

// StudentViewCommonLayout component, responsible for rendering a layout with a common header
function StudentViewCommonLayout() {
    const location = useLocation();  // Get the current location (URL) to conditionally render the header

    return (
        <div>
            {/* If the current path does not include 'course-progress', render the StudentViewCommonHeader */}
            {!location.pathname.includes('course-progress') ? (
                <StudentViewCommonHeader />  // Render the header for all pages except 'course-progress'
            ) : null}

            {/* Outlet renders the child route content */}
            <Outlet />
        </div>
    );
}

export default StudentViewCommonLayout;
