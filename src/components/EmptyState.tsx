import { FC } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

type EmptyStateProps = unknown;

const EmptyState: FC<EmptyStateProps> = () => {
  return (
    <Alert variant="default" className="mb-6">
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        <p>Nic tu zatím není.</p>
      </AlertDescription>
    </Alert>
  );
};
export default EmptyState;
