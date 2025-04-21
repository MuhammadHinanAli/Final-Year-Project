// Import the PayPal SDK to interact with PayPal's REST APIs
const paypal = require("paypal-rest-sdk");

// Configure the PayPal SDK with environment variables for client ID and secret
paypal.configure({
    mode: "sandbox",  // Set the mode to "sandbox" for testing (use "live" for production)
    client_id: process.env.PAYPAL_CLIENT_ID,    // Your PayPal client ID from the .env file
    client_secret: process.env.PAYPAL_SECRET_ID, // Your PayPal secret ID from the .env file
});

// Export the configured PayPal SDK for use in other parts of the application
module.exports = paypal;
