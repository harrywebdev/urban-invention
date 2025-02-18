import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <span
      className={
        "flex justify-center items-center w-full h-full flex-1 text-neutral-200"
      }
    >
      <Loader2 className="animate-spin w-10 h-10" />
    </span>
  );
}
