// Import necessary modules
const User = require("../../models/User");  // Import the User model to interact with the users collection in MongoDB
const bcrypt = require("bcryptjs");         // Import bcryptjs for hashing passwords
const jwt = require("jsonwebtoken");        // Import jsonwebtoken for creating JWTs

// Controller to register a new user
const registerUser = async (req, res) => {
    const { userName, userEmail, password, role } = req.body; // Destructure user data from the request body

    // Check if a user already exists with the same email or username
    const existingUser = await User.findOne({
        $or: [{ userEmail }, { userName }], // Search by either email or username
    });

    // If a user exists with the provided email or username, return an error
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User name or user email already exists", // Error message
        });
    }

    // Hash the password before saving it in the database
    const hashPassword = await bcrypt.hash(password, 10); // Hash the password with 10 salt rounds

    // Create a new user object
    const newUser = new User({
        userName,
        userEmail,
        role,
        password: hashPassword, // Store the hashed password
    });

    // Save the new user to the database
    await newUser.save();

    // Return a success response indicating the user was successfully registered
    return res.status(201).json({
        success: true,
        message: "User registered successfully!", // Success message
    });
};

// Controller to log in an existing user
const loginUser = async (req, res) => {
    const { userEmail, password } = req.body; // Destructure login data from the request body

    // Find the user by their email
    const checkUser = await User.findOne({ userEmail });

    // If the user doesn't exist or the password is incorrect, return an error
    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials", // Error message if login fails
        });
    }

    // Generate a JWT token for the user if credentials are valid
    const accessToken = jwt.sign(
        {
            _id: checkUser._id,               // Include the user's ID in the token payload
            userName: checkUser.userName,     // Include the user's name in the token payload
            userEmail: checkUser.userEmail,   // Include the user's email in the token payload
            role: checkUser.role,             // Include the user's role in the token payload
        },
        "JWT_SECRET", // Secret key used to sign the token (store in env for production)
        { expiresIn: "120m" } // Token expiration time (120 minutes)
    );

    // Return a success response with the access token and user data
    res.status(200).json({
        success: true,
        message: "Logged in successfully", // Success message
        data: {
            accessToken, // The generated JWT token
            user: {
                _id: checkUser._id,
                userName: checkUser.userName,
                userEmail: checkUser.userEmail,
                role: checkUser.role, // Return user data (excluding password)
            },
        },
    });
};

// Export the controller functions to be used in the routes
module.exports = { registerUser, loginUser };
