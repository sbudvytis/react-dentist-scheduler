import { useEffect, useState } from "react";
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

  useEffect(() => {
    const schedule = selectScheduleById(scheduleId);
    setInitialData(schedule);
  }, [scheduleId, selectScheduleById]);

  const handleEditCalendar = (updatedCalendarConfig: CalendarConfig) => {
    editCalendar(updatedCalendarConfig);
  };

  if (schedulesLoading || !initialData) {
    return null;
  }

  return (
    <div>
      <CalendarForm
        initialData={initialData}
        onSubmit={handleEditCalendar}
        onClose={onClose}
        isSubmitting={false}
        submitButtonText="Save Changes"
      />
    </div>
  );
};

export default EditCalendarForm;
