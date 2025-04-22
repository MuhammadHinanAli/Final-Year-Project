// Import the Axios library for making HTTP requests
import axios from "axios";

// Create a reusable Axios instance with a base URL for the backend server
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // All requests made using this instance will be prefixed with this base URL
});

// Add a request interceptor to the Axios instance
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the access token from sessionStorage
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";

    // If the token exists, add it to the Authorization header of the request
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Return the modified config so the request can proceed
    return config;
  },
  (err) =>
    // If there's an error before the request is sent, reject the promise with the error
    Promise.reject(err)
);

// Export the configured Axios instance to be used throughout the application
export default axiosInstance;
