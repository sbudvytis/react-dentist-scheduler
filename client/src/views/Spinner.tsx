// Spinner.tsx
import { Spinner } from "@nextui-org/react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Spinner color="default" size="lg" />
    </div>
  );
}
