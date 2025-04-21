// Import the jsonwebtoken library for creating and verifying JWTs
const jwt = require("jsonwebtoken");

// Function to verify the token using the secret key
// This function decodes the token and checks its validity
const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey); // Verifies the token against the secret key
};

// Middleware function to authenticate a user based on the JWT
const authenticate = (req, res, next) => {
    // Get the Authorization header from the request
    const authHeader = req.headers.authorization;
    console.log(authHeader, "authHeader"); // Logs the authorization header for debugging

    // If the Authorization header is not provided, return a 401 Unauthorized error
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "User is not authenticated", // Message explaining the error
        });
    }

    // Extract the token from the Authorization header (assumes format "Bearer <token>")
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using the secret key (JWT_SECRET)
        const payload = verifyToken(token, "JWT_SECRET");

        // Attach the decoded user information to the request object (req.user)
        req.user = payload;

        // Proceed to the next middleware or route handler
        next();
    } catch (e) {
        // If the token is invalid or expired, return a 401 Unauthorized error
        return res.status(401).json({
            success: false,
            message: "invalid token", // Message explaining the error
        });
    }
};

// Export the authenticate middleware to be used in other parts of the application
module.exports = authenticate;
