import { GraduationCap, TvMinimalPlay } from "lucide-react";  // Import icons from lucide-react
import { Link, useNavigate } from "react-router-dom";  // Import navigation components from react-router-dom
import { Button } from "../ui/button";  // Import Button component from the UI library
import { AuthContext } from "@/context/auth-context";  // Import AuthContext for user authentication
import { useContext } from "react";  // Import useContext to access context values

// StudentViewCommonHeader component for rendering the header in the student view
function StudentViewCommonHeader() {

    const navigate = useNavigate();  // Hook to navigate between routes
    const { resetCredentials } = useContext(AuthContext);  // Get resetCredentials function from AuthContext

    // Function to handle user logout
    function handleLogout() {
        resetCredentials();  // Reset user credentials in the context
        sessionStorage.clear();  // Clear session storage for a clean logout
    }

    return (
        <header className="flex items-center justify-between p-4 border-b relative">
            {/* Left side - EduQuest logo and Explore Courses button */}
            <div className="flex items-center space-x-4">
                {/* Link to home page with EduQuest logo */}
                <Link to="/home" className="flex items-center hover:text-black">
                    <GraduationCap className="h-8 w-8 mr-4" />  {/* Graduation cap icon */}
                    <span className="font-extrabold md:text-xl text-[14px]">EduQuest</span>
                </Link>

                {/* Button to navigate to the courses page */}
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            // Navigate to courses page unless already on it
                            location.pathname.includes('/courses') ? null : navigate('/courses');
                        }}
                        className="text-[14px] md:text-[16px] font-medium"
                    >
                        Explore Courses
                    </Button>
                </div>

                {/* Button to navigate to the AI Chatbot */}
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            navigate('/student/ai-bot');  // Navigate to the AI Chatbot page
                        }}
                        className="text-[14px] md:text-[16px] font-medium"
                    >
                        AI Chatbot
                    </Button>
                </div>
            </div>

            {/* Right side - My Courses and Sign Out button */}
            <div className="flex items-center space-x-4">
                <div className="flex gap-4 items-center">
                    {/* My Courses button with TV icon, navigating to student courses */}
                    <div onClick={() => navigate('/student-courses')} className="flex cursor-pointer items-center gap-3">
                        <span className="font-extrabold md:text-xl text-[14px]">My Courses</span>
                        <TvMinimalPlay className="w-8 h-8 cursor-pointer" />  {/* TV icon */}
                    </div>

                    {/* Button to log the user out */}
                    <Button onClick={handleLogout}>Sign Out</Button>
                </div>
            </div>
        </header>
    );
}

export default StudentViewCommonHeader;
