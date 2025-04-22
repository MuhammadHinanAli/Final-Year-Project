// Importing necessary components and hooks
import CommonForm from "@/components/common-form"; // Common form component for reusability
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Card UI components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Tabs UI components
import { signInFormControls, signUpFormControls } from "@/config"; // Form controls config
import { AuthContext } from "@/context/auth-context"; // Importing authentication context
import { GraduationCap } from "lucide-react"; // Icon for the app logo
import { useContext, useState } from "react"; // React hooks for state management and context
import { Link } from "react-router-dom"; // Link component for routing

function AuthPage() {
  // State to manage the active tab (signin or signup)
  const [activeTab, setActiveTab] = useState("signin");

  // Destructuring necessary values and functions from AuthContext
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  // Function to handle tab change between Sign In and Sign Up
  function handleTabChange(value) {
    setActiveTab(value);
  }

  // Function to validate if the Sign In form is filled out correctly
  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  // Function to validate if the Sign Up form is filled out correctly
  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  // Debug log to inspect the current state of signInFormData
  console.log(signInFormData);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with logo and app name */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" /> {/* App logo */}
          <span className="font-extrabold text-xl">EduQuest</span> {/* App name */}
        </Link>
      </header>

      {/* Main content area with tabs for Sign In and Sign Up */}
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs
          value={activeTab} // Controlled component for active tab
          defaultValue="signin" // Default tab to show on initial load
          onValueChange={handleTabChange} // Function to handle tab switch
          className="w-full max-w-md" // Width constraints for the tabs container
        >
          <TabsList className="grid w-full grid-cols-2"> {/* List of tab options */}
            <TabsTrigger value="signin">Sign In</TabsTrigger> {/* Sign In tab */}
            <TabsTrigger value="signup">Sign Up</TabsTrigger> {/* Sign Up tab */}
          </TabsList>

          {/* Content for Sign In tab */}
          <TabsContent value="signin">
            <Card className="p-6 space-y-4"> {/* Card container for sign-in */}
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Common form for Sign In */}
                <CommonForm
                  formControls={signInFormControls} // Form controls for sign-in
                  buttonText={"Sign In"} // Button text for sign-in
                  formData={signInFormData} // Current form data for sign-in
                  setFormData={setSignInFormData} // Function to update form data
                  isButtonDisabled={!checkIfSignInFormIsValid()} // Disable button if form is invalid
                  handleSubmit={handleLoginUser} // Submit function for sign-in
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content for Sign Up tab */}
          <TabsContent value="signup">
            <Card className="p-6 space-y-4"> {/* Card container for sign-up */}
              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Common form for Sign Up */}
                <CommonForm
                  formControls={signUpFormControls} // Form controls for sign-up
                  buttonText={"Sign Up"} // Button text for sign-up
                  formData={signUpFormData} // Current form data for sign-up
                  setFormData={setSignUpFormData} // Function to update form data
                  isButtonDisabled={!checkIfSignUpFormIsValid()} // Disable button if form is invalid
                  handleSubmit={handleRegisterUser} // Submit function for sign-up
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
