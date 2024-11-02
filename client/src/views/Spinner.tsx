import { Spinner } from "@nextui-org/react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full gap-2">
      <Spinner color="default" size="lg" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  );
}
