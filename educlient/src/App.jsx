// Import necessary modules and components
import { Route, Routes } from "react-router-dom"; // For defining app routes
import AuthPage from "./pages/auth"; // Login/Register page
import RouteGuard from "./components/route-guard"; // Custom component to protect routes based on authentication
import { useContext } from "react"; // To access context
import { AuthContext } from "./context/auth-context"; // Authentication context provider
import InstructorDashboardpage from "./pages/instructor"; // Instructor's dashboard
import StudentViewCommonLayout from "./components/student-view/common-layout"; // Shared layout for student pages
import StudentHomePage from "./pages/student/home"; // Student homepage
import NotFoundPage from "./pages/not-found"; // 404 page
import AddNewCoursePage from "./pages/instructor/add-new-course"; // Page to create/edit courses
import StudentViewCoursesPage from "./pages/student/courses"; // List of all available courses
import StudentViewCourseDetailsPage from "./pages/student/course-details"; // Course detail view
import PaypalPaymentReturnPage from "./pages/student/payment-return"; // Payment confirmation page
import StudentCoursesPage from "./pages/student/student-courses"; // Student’s enrolled courses
import StudentViewCourseProgressPage from "./pages/student/course-progress"; // Course progress view
import StudentViewAiChatbot from "./pages/student/ai-chatbot"; // AI Chatbot component for student help

function App() {

  // Get auth object from AuthContext to determine if user is authenticated and who they are
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      {/* Auth Route - Login/Register */}
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Instructor Dashboard */}
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Create New Course (Instructor) */}
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Edit Existing Course by ID (Instructor) */}
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Student section with nested routes and common layout */}
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        {/* Nested student routes */}
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route path="student/ai-bot" element={<StudentViewAiChatbot />} />
        <Route path="course/details/:id" element={<StudentViewCourseDetailsPage />} />
        <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route path="course-progress/:id" element={<StudentViewCourseProgressPage />} />
      </Route>

      {/* Catch-all route for undefined paths */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;
