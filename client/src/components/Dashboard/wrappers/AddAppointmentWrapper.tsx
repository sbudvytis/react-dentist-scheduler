import AddAppointmentForm from "@/components/Dashboard/Forms/Appointment/AddAppointmentForm";
import useAppointments from "@/hooks/useAppointment";
import useCalendar from "@/hooks/useCalendar";
import LoadingSpinner from "@/views/Spinner";

interface AddAppointmentWrapperProps {
  onClose: () => void;
  selectedDateRange: { start: Date; end: Date };
}

const AddAppointmentWrapper: React.FC<AddAppointmentWrapperProps> = ({
  onClose,
  selectedDateRange,
}) => {
  const { schedules } = useCalendar();
  const scheduleId = schedules.length > 0 ? schedules[0].scheduleId : null;
  const { addAppointment } = useAppointments(scheduleId);

  if (!scheduleId || !addAppointment) {
    return <LoadingSpinner />;
  }

  return (
    <AddAppointmentForm
      scheduleId={scheduleId}
      onClose={onClose}
      selectedDateRange={selectedDateRange}
    />
  );
};

export default AddAppointmentWrapper;
