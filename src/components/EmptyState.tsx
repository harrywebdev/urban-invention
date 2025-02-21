import { FC } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  className?: string;
};

const EmptyState: FC<EmptyStateProps> = ({ className }) => {
  return (
    <div className={cn("mb-6", className)}>
      <Alert variant="default">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <p>Nic tu zatím není.</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};
export default EmptyState;
