// Import the mongoose library to define schemas and interact with MongoDB
const mongoose = require("mongoose");

// Define the User schema
// Represents a user, including their basic details like name, email, and role
const UserSchema = new mongoose.Schema({
    userName: String,         // Username of the user
    userEmail: String,        // Email address of the user
    password: String,         // Hashed password of the user (ensure to hash this before storing)
    role: String,             // Role of the user (e.g., "student", "instructor", "admin")
});

// Export the User model based on the UserSchema
// This model can be used to interact with the "users" collection in MongoDB
module.exports = mongoose.model("User", UserSchema);
