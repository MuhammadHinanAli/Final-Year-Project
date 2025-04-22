import { Navigate, useLocation } from "react-router-dom";  // Import necessary components from react-router-dom
import { Fragment } from "react";  // Fragment to wrap JSX without adding extra nodes

// RouteGuard component that manages access control based on authentication and user role
function RouteGuard({ authenticated, user, element }) {
    const location = useLocation();  // Get current location (URL) for routing logic

    console.log(authenticated, user, "useruser");  // Log authentication status and user data (for debugging)

    // If user is not authenticated and the current location is not in the "/auth" path, redirect to /auth
    if (!authenticated && !location.pathname.includes("/auth")) {
        return <Navigate to="/auth" />;  // Navigate to authentication page
    }

    // If the user is authenticated but their role is not "instructor", and they are trying to access an instructor page or auth page, redirect to /home
    if (
        authenticated &&
        user?.role !== "instructor" &&
        (location.pathname.includes("instructor") ||
            location.pathname.includes("/auth"))
    ) {
        return <Navigate to="/home" />;  // Redirect to home if user is not an instructor
    }

    // If the user is authenticated, their role is "instructor", but they are not on the instructor page, redirect them to the /instructor page
    if (
        authenticated &&
        user.role === "instructor" &&
        !location.pathname.includes("instructor")
    ) {
        return <Navigate to="/instructor" />;  // Redirect to instructor page if user is an instructor
    }

    // If none of the above conditions are met, render the element passed to RouteGuard
    return <Fragment>{element}</Fragment>;  // Render the provided element (e.g., the protected page content)
}

export default RouteGuard;
