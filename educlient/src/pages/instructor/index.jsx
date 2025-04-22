// Importing necessary components and libraries
import InstructorCourses from "@/components/instructor-view/courses"; // Courses management component
import InstructorDashboard from "@/components/instructor-view/dashboard"; // Dashboard component
import { Button } from "@/components/ui/button"; // Button UI component
import { Tabs, TabsContent } from "@/components/ui/tabs"; // Tabs UI components
import { AuthContext } from "@/context/auth-context"; // Auth context to manage user credentials
import { InstructorContext } from "@/context/instructor-context"; // Instructor context to manage course data
import { fetchInstructorCourseListService } from "@/services"; // Service to fetch the list of courses
import { BarChart, Book, LogOut } from "lucide-react"; // Icons for the tabs
import { useContext, useEffect, useState } from "react"; // React hooks for managing state and lifecycle

function InstructorDashboardpage() {
    // State to manage the active tab (dashboard, courses, logout)
    const [activeTab, setActiveTab] = useState("dashboard");

    // Using AuthContext to reset user credentials on logout
    const { resetCredentials } = useContext(AuthContext);

    // Using InstructorContext to manage the list of courses
    const { instructorCoursesList, setInstructorCoursesList } = useContext(InstructorContext);

    // Function to fetch all courses for the instructor
    async function fetchAllCourses() {
        const response = await fetchInstructorCourseListService();
        if (response?.success) setInstructorCoursesList(response?.data);
    }

    // useEffect hook to fetch courses when the component mounts
    useEffect(() => {
        fetchAllCourses();
    }, []);

    // Menu items for the sidebar with associated icons, labels, and components
    const menuItems = [
        {
            icon: BarChart,
            label: "Dashboard",
            value: "dashboard",
            component: <InstructorDashboard listOfCourses={instructorCoursesList} />, // Dashboard component
        },
        {
            icon: Book,
            label: "Courses",
            value: "courses",
            component: <InstructorCourses listOfCourses={instructorCoursesList} />, // Courses management component
        },
        {
            icon: LogOut,
            label: "Logout",
            value: "logout",
            component: null, // Logout has no associated component, it just triggers logout
        },
    ];

    // Handle logout by resetting credentials and clearing session storage
    function handleLogout() {
        resetCredentials(); // Reset authentication state
        sessionStorage.clear(); // Clear session storage
    }

    console.log(instructorCoursesList, "instructorCoursesList"); // Logging the list of instructor courses for debugging

    return (
        <div className="flex h-full min-h-screen bg-gray-100">
            {/* Sidebar navigation */}
            <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
                    <nav>
                        {/* Mapping through menu items to render buttons */}
                        {menuItems.map((menuItem) => (
                            <Button
                                className="w-full justify-start mb-2"
                                key={menuItem.value}
                                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                                onClick={
                                    menuItem.value === "logout"
                                        ? handleLogout // Logout functionality
                                        : () => setActiveTab(menuItem.value) // Change active tab
                                }
                            >
                                {/* Render menu item icon and label */}
                                <menuItem.icon className="mr-2 h-4 w-4" />
                                {menuItem.label}
                            </Button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                    {/* Tabs to switch between dashboard, courses, and logout */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        {/* Mapping through menu items to render the appropriate content */}
                        {menuItems.map((menuItem) => (
                            <TabsContent value={menuItem.value}>
                                {/* Render the component if it's not null */}
                                {menuItem.component !== null ? menuItem.component : null}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

export default InstructorDashboardpage;
