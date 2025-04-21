// Import the mongoose library to define schemas and interact with MongoDB
const mongoose = require("mongoose");

// Define the Order schema
// Represents an order placed by a student for a course
const OrderSchema = new mongoose.Schema({
    userId: String,               // ID of the student who placed the order
    userName: String,             // Name of the student
    userEmail: String,            // Email of the student
    orderStatus: String,          // Status of the order (e.g., "Pending", "Completed")
    paymentMethod: String,        // Payment method used (e.g., "Credit Card", "PayPal")
    paymentStatus: String,        // Status of the payment (e.g., "Success", "Failed")
    orderDate: Date,              // Date when the order was placed
    paymentId: String,            // Payment transaction ID
    payerId: String,              // Payer's ID (could be used for payment gateway references)
    instructorId: String,         // ID of the instructor offering the course
    instructorName: String,       // Name of the instructor
    courseImage: String,          // URL of the course image
    courseTitle: String,          // Title of the course
    courseId: String,             // ID of the course
    coursePricing: String,        // Price of the course
});

// Export the Order model based on the OrderSchema
// This model can be used to interact with the "orders" collection in MongoDB
module.exports = mongoose.model("Order", OrderSchema);
