import { Button } from "../ui/button";
import FormControls from "./form-controls";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}) {
  return (
    <form onSubmit={handleSubmit}>
      {/* render form controls here */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button type="submit">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;