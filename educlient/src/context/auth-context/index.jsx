// Importing necessary components and hooks
import { Skeleton } from "@/components/ui/skeleton"; // A loading placeholder component
import { initialSignInFormData, initialSignUpFormData } from "@/config"; // Default values for forms
import { checkAuthService, loginService, registerService } from "@/services"; // Authentication services
import { createContext, useEffect, useState } from "react"; // React hooks and context API

// Creating an authentication context to be shared across components
export const AuthContext = createContext(null);

// AuthProvider component that wraps children and provides authentication context
export default function AuthProvider({ children }) {
    // State for sign-in form data
    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);

    // State for sign-up form data
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

    // State to manage authentication status and user information
    const [auth, setAuth] = useState({
        authenticate: false,
        user: null,
    });

    // State to manage loading status
    const [loading, setLoading] = useState(true);

    // Function to handle user registration
    async function handleRegisterUser(event) {
        event.preventDefault(); // Prevent form from refreshing the page
        const data = await registerService(signUpFormData); // Call register service with form data
        // You might want to handle the response (e.g., display messages)
    }

    // Function to handle user login
    async function handleLoginUser(event) {
        event.preventDefault(); // Prevent form default submission
        const data = await loginService(signInFormData); // Call login service
        console.log(data, "datadatadatadatadata");

        if (data.success) {
            // Store access token in session storage
            sessionStorage.setItem(
                "accessToken",
                JSON.stringify(data.data.accessToken)
            );
            // Update auth state on success
            setAuth({
                authenticate: true,
                user: data.data.user,
            });
        } else {
            // Reset auth state on failure
            setAuth({
                authenticate: false,
                user: null,
            });
        }
    }

    // Function to check if user is already authenticated (e.g., on page refresh)
    async function checkAuthUser() {
        try {
            const data = await checkAuthService(); // Call check auth service

            if (data.success) {
                // Update auth state if token is valid
                setAuth({
                    authenticate: true,
                    user: data.data.user,
                });
            } else {
                // Reset auth state if invalid
                setAuth({
                    authenticate: false,
                    user: null,
                });
            }
            setLoading(false); // Stop loading either way
        } catch (error) {
            console.log(error);
            // Handle error response safely
            if (!error?.response?.data?.success) {
                setAuth({
                    authenticate: false,
                    user: null,
                });
                setLoading(false);
            }
        }
    }

    // Function to reset authentication credentials (e.g., on logout)
    function resetCredentials() {
        setAuth({
            authenticate: false,
            user: null,
        });
    }

    // useEffect to check authentication when component is first mounted
    useEffect(() => {
        checkAuthUser();
    }, []);

    console.log(auth, "gf"); // Debug log for auth state

    return (
        // Providing auth context values to all children components
        <AuthContext.Provider
            value={{
                signInFormData,
                setSignInFormData,
                signUpFormData,
                setSignUpFormData,
                handleRegisterUser,
                handleLoginUser,
                auth,
                resetCredentials,
            }}
        >
            {/* Show loading skeleton while checking auth */}
            {loading ? <Skeleton /> : children}
        </AuthContext.Provider>
    );
}
