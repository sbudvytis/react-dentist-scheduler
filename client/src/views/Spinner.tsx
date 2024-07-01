import { Spinner } from "@nextui-org/react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center pt-72">
      <Spinner size="md" color="default" />
    </div>
  );
}
