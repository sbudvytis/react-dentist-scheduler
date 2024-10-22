import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAddAppointment from "@/hooks/useAppointment";
import useFormDataStore from "@/stores/useAppointmentFormStore";
import AppointmentForm from "./AppointmentForm";
import { Appointment } from "@/components/Dashboard/types";
import { useSelectedSchedule } from "@/hooks/useSelectedSchedule";

interface AddAppointmentFormProps {
  scheduleId: number | null;
  selectedDateRange: { start: Date; end: Date };
  onClose: () => void;
}

const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({
  selectedDateRange,
  onClose,
}) => {
  const { selectedScheduleId } = useSelectedSchedule();
  const {
    addAppointment,
    addAppointmentLoading,
    removeAppointmentLoading,
    appointmentsError,
  } = useAddAppointment(selectedScheduleId);
  const { formData, setFormData } = useFormDataStore();
  const [localFormData, setLocalFormData] = useState<Appointment>(formData);

  useEffect(() => {
    if (selectedDateRange && selectedDateRange.start !== formData.start) {
      setFormData({
        ...formData,
        start: selectedDateRange.start,
        end: selectedDateRange.end,
      });
      setLocalFormData((prev: Appointment) => ({
        ...prev,
        start: selectedDateRange.start,
        end: selectedDateRange.end,
      }));
    }
  }, [selectedDateRange, setFormData, formData]);

  const handleAddAppointment = async (appointmentData: Appointment) => {
    if (selectedScheduleId !== null) {
      try {
        addAppointment({
          ...appointmentData,
          scheduleId: selectedScheduleId,
        });
        toast.success("Appointment created successfully!");
      } catch (error) {
        toast.error("Failed to create appointment.");
      }
      onClose();
    } else {
      console.error("Selected schedule ID is null");
    }
  };

  return (
    <>
      <AppointmentForm
        initialData={localFormData}
        onSubmit={handleAddAppointment}
        onClose={onClose}
        selectedDateRange={selectedDateRange}
        isSubmitting={addAppointmentLoading}
        submitButtonText="Create Appointment"
        loading={removeAppointmentLoading}
        showAutocomplete={true}
        isEditing={false}
      />
      {appointmentsError && (
        <p className="text-red-500 text-sm mt-2">{appointmentsError}</p>
      )}
    </>
  );
};

export default AddAppointmentForm;
