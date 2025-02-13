import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const FormErrorMessage = ({
  errorMessage,
}: {
  errorMessage: string | null;
}) => {
  return errorMessage ? (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />

      <AlertDescription>
        <p>{errorMessage}</p>
      </AlertDescription>
    </Alert>
  ) : null;
};

export default FormErrorMessage;
