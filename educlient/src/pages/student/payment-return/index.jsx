import { Card, CardHeader, CardTitle } from "@/components/ui/card"; // Import UI components for displaying the card
import { captureAndFinalizePaymentService } from "@/services"; // Import the service for capturing and finalizing payment
import { useEffect } from "react"; // Import the useEffect hook for side effects
import { useLocation } from "react-router-dom"; // Import the useLocation hook to access the current location

function PaypalPaymentReturnPage() {
    // Use the useLocation hook to get the current URL and its query parameters
    const location = useLocation();
    const params = new URLSearchParams(location.search); // Parse the query parameters from the URL
    const paymentId = params.get("paymentId"); // Extract the payment ID from the URL parameters
    const payerId = params.get("PayerID"); // Extract the payer ID from the URL parameters

    useEffect(() => {
        // If both paymentId and payerId are available, initiate the payment capture process
        if (paymentId && payerId) {
            async function capturePayment() {
                // Retrieve the current order ID from sessionStorage
                const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

                // Call the service to capture and finalize the payment using paymentId, payerId, and orderId
                const response = await captureAndFinalizePaymentService(
                    paymentId,
                    payerId,
                    orderId
                );

                // If the payment is successful, remove the current order ID from sessionStorage and redirect to student courses page
                if (response?.success) {
                    sessionStorage.removeItem("currentOrderId"); // Clear the order ID from sessionStorage
                    window.location.href = "/student-courses"; // Redirect the user to the courses page
                }
            }

            capturePayment(); // Call the capturePayment function to initiate the payment process
        }
    }, [payerId, paymentId]); // The effect runs when either payerId or paymentId changes

    return (
        // Display a loading message while the payment is being processed
        <Card>
            <CardHeader>
                <CardTitle>Processing payment... Please wait</CardTitle>
            </CardHeader>
        </Card>
    );
}

export default PaypalPaymentReturnPage; // Export the component to be used elsewhere
