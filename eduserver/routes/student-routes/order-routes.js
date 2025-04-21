// Import the Express framework
const express = require("express");

// Import controller functions for handling student orders
const {
  createOrder,
  capturePaymentAndFinalizeOrder,
} = require("../../controllers/student-controller/order-controller");

// Create a new Express router instance
const router = express.Router();

// Route to create a new order for a student (POST request)
// Endpoint: /student/order/create
// This will initiate the order creation process (e.g., course order)
router.post("/create", createOrder);

// Route to capture payment and finalize the order (POST request)
// Endpoint: /student/order/capture
// This will capture the payment and finalize the order, marking it as complete
router.post("/capture", capturePaymentAndFinalizeOrder);

// Export the router so it can be used in the main server file
module.exports = router;
