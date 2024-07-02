import CalendarForm from "./CalendarForm";
import useCalendar from "@/hooks/useCalendar";
import { CalendarConfig } from "@/components/Dashboard/types";
import { toast } from "react-toastify";

interface AddCalendarFormProps {
  onClose: () => void;
}

const AddCalendarForm: React.FC<AddCalendarFormProps> = ({ onClose }) => {
  const { addCalendar, addCalendarLoading } = useCalendar();

  const handleAddCalendar = (newCalendarConfig: CalendarConfig) => {
    try {
      addCalendar(newCalendarConfig);
      toast.success("Schedule created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create schedule.");
      console.error("Error creating schedule:", error);
    }
  };

  const initialData: CalendarConfig = {
    userId: 0,
    scheduleId: 0,
    view: "timeGridWeek",
    weekends: true,
    slotMinTime: "08:00:00",
    slotMaxTime: "17:00:00",
  };

  return (
    <CalendarForm
      initialData={initialData}
      onSubmit={handleAddCalendar}
      onClose={onClose}
      isSubmitting={addCalendarLoading}
      submitButtonText="Create Schedule"
    />
  );
};

export default AddCalendarForm;
