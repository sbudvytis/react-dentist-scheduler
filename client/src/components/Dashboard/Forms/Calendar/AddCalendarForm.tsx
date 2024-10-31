import { useState } from "react";
import CalendarForm from "./CalendarForm";
import useCalendar from "@/hooks/useCalendar";
import { CalendarConfig } from "@/components/Dashboard/types";
import { toast } from "react-toastify";

interface AddCalendarFormProps {
  onClose: () => void;
}

const AddCalendarForm: React.FC<AddCalendarFormProps> = ({ onClose }) => {
  const { addCalendar } = useCalendar();
  const [loading, setLoading] = useState(false); // Track loading state

  const handleAddCalendar = async (newCalendarConfig: CalendarConfig) => {
    setLoading(true); // Set loading state to true
    try {
      await addCalendar(newCalendarConfig); // Await async operation
      toast.success("Schedule created successfully!");
      onClose(); // Close the modal on success
    } catch (error) {
      toast.error("Failed to create schedule.");
      console.error("Error creating schedule:", error);
    } finally {
      setLoading(false); // Ensure loading state is turned off
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
      isSubmitting={loading} // Pass loading state to CalendarForm
      submitButtonText="Create Schedule"
    />
  );
};

export default AddCalendarForm;
