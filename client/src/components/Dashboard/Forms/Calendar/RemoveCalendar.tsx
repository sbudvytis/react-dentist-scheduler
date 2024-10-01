import { useState } from "react";
import { toast } from "react-toastify";
import useCalendar from "@/hooks/useCalendar";
import { Button } from "@nextui-org/react";

interface RemoveScheduleProps {
  onClose: () => void;
}

const RemoveSchedule: React.FC<RemoveScheduleProps> = ({ onClose }) => {
  const { schedules, removeSchedule, removeScheduleError } = useCalendar();
  const [loading, setLoading] = useState(false);

  const config = schedules.length > 0 ? schedules[0] : null;

  const handleRemoveSchedule = async () => {
    setLoading(true);
    try {
      if (config) {
        await removeSchedule(config);
      } else {
        toast.error("No schedule to remove.");
      }
      toast.success("Schedule removed successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to remove schedule.");
      console.error("Error removing schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-lg p-6">
      <div className="grid space-y-4">
        <div className="pb-4 flex-col space-y-2">
          <h1 className="lg:text-3xl text-xl font-semibold">
            Remove a schedule
          </h1>
          <p className="text-gray-500">
            Are you sure you want to remove your schedule?
          </p>
        </div>
        {removeScheduleError && (
          <div className="text-rose-500 text-center text-sm">
            {removeScheduleError}
          </div>
        )}
        <Button
          onClick={handleRemoveSchedule}
          variant="bordered"
          radius="sm"
          color="danger"
          disabled={loading}
          className="mt-2 border-1 border-rose-500 shadow-md shadow-rose-100"
        >
          {loading ? "Removing..." : "Remove Schedule"}
        </Button>
      </div>
    </div>
  );
};

export default RemoveSchedule;
