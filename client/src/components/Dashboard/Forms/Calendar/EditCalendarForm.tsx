import { useEffect, useState } from "react";
import showToast from "@/utils/showToast";
import CalendarForm from "./CalendarForm";
import useCalendar from "@/hooks/useCalendar";
import { CalendarConfig } from "@/components/Dashboard/types";

interface EditCalendarFormProps {
  scheduleId: number | null;
  onClose: () => void;
}

const EditCalendarForm: React.FC<EditCalendarFormProps> = ({
  scheduleId,
  onClose,
}) => {
  const { selectScheduleById, editCalendar, schedulesLoading } = useCalendar();
  const [initialData, setInitialData] = useState<CalendarConfig | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const schedule = selectScheduleById(scheduleId);
    if (schedule) {
      setInitialData(schedule);
    }
  }, [scheduleId, selectScheduleById]);

  const handleEditCalendar = async (updatedCalendarConfig: CalendarConfig) => {
    setLoading(true);
    try {
      await editCalendar(updatedCalendarConfig);
      showToast("success", "Schedule updated successfully!");
      onClose();
    } catch (error) {
      showToast("error", "Failed to update schedule!");
      console.error("Error updating schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  if (schedulesLoading || !initialData) {
    return null;
  }

  return (
    <>
      <CalendarForm
        initialData={initialData}
        onSubmit={handleEditCalendar}
        onClose={onClose}
        isSubmitting={loading}
        submitButtonText="Save Changes"
      />
    </>
  );
};

export default EditCalendarForm;
