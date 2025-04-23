// Importing necessary components and hooks
import CommonForm from "@/components/common-form"; // Common form component for reusability
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Card UI components for layout
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Tabs UI components for switching between forms
import { signInFormControls, signUpFormControls } from "@/config"; // Form controls configuration for sign-in and sign-up
import { AuthContext } from "@/context/auth-context"; // Importing authentication context to manage user data
import { GraduationCap } from "lucide-react"; // Icon for the app logo
import { useContext, useState } from "react"; // React hooks for context and state management
import { Link } from "react-router-dom"; // Link component for routing within the app

function AuthPage() {
  // State to manage the active tab (signin or signup)
  const [activeTab, setActiveTab] = useState("signin");

  // Accessing authentication context data and methods
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  // Function to handle tab change between sign-in and sign-up forms
  function handleTabChange(value) {
    setActiveTab(value);
  }

  // Function to check if the sign-in form is valid
  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  // Function to check if the sign-up form is valid
  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section with logo and app name */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-center border-b bg-white shadow-md">
        <Link to={"/"} className="flex items-center">
          {/* App logo with graduation cap icon */}
          <GraduationCap className="h-10 w-10 mr-4 text-indigo-600" />
          <span className="font-extrabold text-2xl text-gray-800">EduQuest</span>
        </Link>
      </header>

      {/* Main content section, with tabs for switching between sign-in and sign-up */}
      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-10">
        <Tabs
          value={activeTab} // Set the active tab based on the state
          defaultValue="signin" // Default tab is sign-in
          onValueChange={handleTabChange} // Handle tab change
          className="w-full max-w-lg"
        >
          {/* Tab list with options for sign-in and sign-up */}
          <TabsList className="grid w-full grid-cols-2 gap-2 mb-4">
            <TabsTrigger
              value="signin" // Sign-in tab
              className="py-2 px-4 rounded-md text-lg font-semibold transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup" // Sign-up tab
              className="py-2 px-4 rounded-md text-lg font-semibold transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Sign-in tab content */}
          <TabsContent value="signin">
            <Card className="p-6 space-y-6 shadow-lg rounded-md bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-700">Sign in to your account</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Enter your email and password to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Common form component for sign-in */}
                <CommonForm
                  formControls={signInFormControls} // Form fields for sign-in
                  buttonText={"Sign In"} // Button text for sign-in
                  formData={signInFormData} // Form data for sign-in
                  setFormData={setSignInFormData} // Function to update form data
                  isButtonDisabled={!checkIfSignInFormIsValid()} // Disable button if form is invalid
                  handleSubmit={handleLoginUser} // Handle sign-in form submission
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign-up tab content */}
          <TabsContent value="signup">
            <Card className="p-6 space-y-6 shadow-lg rounded-md bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-700">Create a new account</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Enter your details to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Common form component for sign-up */}
                <CommonForm
                  formControls={signUpFormControls} // Form fields for sign-up
                  buttonText={"Sign Up"} // Button text for sign-up
                  formData={signUpFormData} // Form data for sign-up
                  setFormData={setSignUpFormData} // Function to update form data
                  isButtonDisabled={!checkIfSignUpFormIsValid()} // Disable button if form is invalid
                  handleSubmit={handleRegisterUser} // Handle sign-up form submission
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
