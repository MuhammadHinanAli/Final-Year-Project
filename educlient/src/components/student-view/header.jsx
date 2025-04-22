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
        <header className="flex items-center justify-between p-4 border-b relative bg-white shadow-md">
            {/* Left side - EduQuest logo and Explore Courses button */}
            <div className="flex items-center space-x-6">
                {/* Link to home page with EduQuest logo */}
                <Link to="/home" className="flex items-center hover:text-blue-600 transition-colors duration-300">
                    <GraduationCap className="h-10 w-10 mr-4 text-indigo-600" /> {/* Graduation cap icon */}
                    <span className="font-extrabold text-xl md:text-2xl text-gray-800">EduQuest</span>
                </Link>

                {/* Button to navigate to the courses page */}
                <div className="flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            // Navigate to courses page unless already on it
                            location.pathname.includes('/courses') ? null : navigate('/courses');
                        }}
                        className="text-[14px] md:text-[16px] font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300"
                    >
                        Explore Courses
                    </Button>
                </div>

                {/* Button to navigate to the AI Chatbot */}
                <div className="flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            navigate('/student/ai-bot');  // Navigate to the AI Chatbot page
                        }}
                        className="text-[14px] md:text-[16px] font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300"
                    >
                        AI Chatbot
                    </Button>
                </div>
            </div>

            {/* Right side - My Courses and Sign Out button */}
            <div className="flex items-center space-x-6">
                <div className="flex gap-6 items-center">
                    {/* My Courses button with TV icon, navigating to student courses */}
                    <div onClick={() => navigate('/student-courses')} className="flex cursor-pointer items-center gap-3 hover:text-blue-600 transition-colors duration-300">
                        <span className="font-extrabold text-lg md:text-xl text-gray-800">My Courses</span>
                        <TvMinimalPlay className="w-8 h-8 cursor-pointer text-gray-600 hover:text-blue-600 transition-colors duration-300" />
                    </div>

                    {/* Button to log the user out */}
                    <Button onClick={handleLogout} className="text-red-500 hover:bg-red-100 transition-colors duration-300">
                        Sign Out
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default StudentViewCommonHeader;
