import { Input } from "../ui/input"; // Import the Input component for rendering input fields
import { Label } from "../ui/label"; // Import the Label component for form field labels
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // Import components related to the Select dropdown
import { Textarea } from "../ui/textarea"; // Import the Textarea component for multi-line inputs

// FormControls component renders different form controls dynamically based on the input data
function FormControls({ formControls = [], formData, setFormData }) {
  // Function that renders a form component based on the component type
  function renderComponentByType(getControlItem) {
    let element = null; // Initialize the element variable which will hold the rendered component
    const currentControlItemValue = formData[getControlItem.name] || ""; // Get the current value from formData or default to empty string

    // Switch statement to handle different control types (input, select, textarea, etc.)
    switch (getControlItem.componentType) {
      case "input":
        // If the control type is "input", render an Input field
        element = (
          <Input
            id={getControlItem.name} // Set the id of the input to the control name
            name={getControlItem.name} // Set the name of the input field
            placeholder={getControlItem.placeholder} // Set the placeholder text
            type={getControlItem.type} // Set the input type (text, email, etc.)
            value={currentControlItemValue} // Bind the value to the formData
            onChange={(event) => // Handle changes to input field
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value, // Update formData with the new value
              })
            }
          />
        );
        break;
      case "select":
        // If the control type is "select", render a Select dropdown
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value, // Update formData with selected value
              })
            }
            value={currentControlItemValue} // Bind the selected value to formData
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} /> {/* Display the placeholder */}
            </SelectTrigger>
            <SelectContent>
              {/* If options are provided, map through them to render SelectItem elements */}
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                  <SelectItem key={optionItem.id} value={optionItem.id}>
                    {optionItem.label} {/* Display each option label */}
                  </SelectItem>
                ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        // If the control type is "textarea", render a Textarea component
        element = (
          <Textarea
            id={getControlItem.name} // Set the id of the textarea to the control name
            name={getControlItem.name} // Set the name of the textarea
            placeholder={getControlItem.placeholder} // Set the placeholder text
            value={currentControlItemValue} // Bind the value to formData
            onChange={(event) => // Handle changes to textarea field
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value, // Update formData with the new value
              })
            }
          />
        );
        break;

      default:
        // Default case: If no recognized componentType, render a default Input field
        element = (
          <Input
            id={getControlItem.name} // Set the id of the input to the control name
            name={getControlItem.name} // Set the name of the input field
            placeholder={getControlItem.placeholder} // Set the placeholder text
            type={getControlItem.type} // Set the input type
            value={currentControlItemValue} // Bind the value to formData
            onChange={(event) => // Handle changes to input field
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value, // Update formData with the new value
              })
            }
          />
        );
        break;
    }

    return element; // Return the rendered element
  }

  return (
    // Render the form controls dynamically based on the provided formControls array
    <div className="flex flex-col gap-3">
      {formControls.map((controleItem) => (
        // For each form control item, render its corresponding label and input component
        <div key={controleItem.name}>
          <Label htmlFor={controleItem.name}>{controleItem.label}</Label> {/* Label for the control */}
          {renderComponentByType(controleItem)} {/* Render the corresponding component */}
        </div>
      ))}
    </div>
  );
}

export default FormControls; // Export the FormControls component for use elsewhere
