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
  const [activeTab, setActiveTab] = useState("signin");

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

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
      <header className="px-4 lg:px-6 h-16 flex items-center justify-center border-b bg-white shadow-md">
        <Link to={"/"} className="flex items-center">
          <GraduationCap className="h-10 w-10 mr-4 text-indigo-600" />
          <span className="font-extrabold text-2xl text-gray-800">EduQuest</span>
        </Link>
      </header>

      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-10">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-lg"
        >
          <TabsList className="grid w-full grid-cols-2 gap-2 mb-4">
            <TabsTrigger
              value="signin"
              className="py-2 px-4 rounded-md text-lg font-semibold transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="py-2 px-4 rounded-md text-lg font-semibold transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="p-6 space-y-6 shadow-lg rounded-md bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-700">Sign in to your account</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Enter your email and password to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="p-6 space-y-6 shadow-lg rounded-md bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-700">Create a new account</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Enter your details to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={"Sign Up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={handleRegisterUser}
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
