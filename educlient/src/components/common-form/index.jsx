import { Button } from "../ui/button"; // Import the Button component for rendering the submit button
import FormControls from "./form-controls"; // Import the FormControls component for dynamically rendering form inputs

// CommonForm component handles the structure of a common form with dynamic controls and submission
function CommonForm({
  handleSubmit, // Function to handle form submission
  buttonText, // The text displayed on the submit button
  formControls = [], // Array of form control objects to define form inputs
  formData, // The form data that is bound to the input fields
  setFormData, // Function to update the form data
  isButtonDisabled = false, // Boolean to enable or disable the submit button
}) {
  return (
    // Form element that handles submission through the handleSubmit function
    <form onSubmit={handleSubmit}>
      {/* Render dynamic form controls based on the provided formControls array */}
      <FormControls
        formControls={formControls} // Pass the form controls configuration to FormControls
        formData={formData} // Bind the form data to FormControls
        setFormData={setFormData} // Pass the setFormData function to FormControls for updating data
      />
      {/* Submit button */}
      <Button
        disabled={isButtonDisabled} // Disable button if isButtonDisabled is true
        type="submit" // Set the button type to "submit" to trigger form submission
        className="mt-5 w-full" // Apply margin and full width to the button
      >
        {buttonText || "Submit"} {/* Use custom buttonText or default to "Submit" */}
      </Button>
    </form>
  );
}

export default CommonForm; // Export the CommonForm component for use in other parts of the application
