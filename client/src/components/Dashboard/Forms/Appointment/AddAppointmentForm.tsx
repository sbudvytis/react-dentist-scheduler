// src/components/forms/AddAppointmentForm.tsx
import { useEffect, useState } from "react";
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

  const handleAddAppointment = (appointmentData: Appointment) => {
    if (selectedScheduleId !== null) {
      addAppointment({
        ...appointmentData,
        scheduleId: selectedScheduleId,
      });
      onClose();
    } else {
      console.error("Selected schedule ID is null");
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-lg bg-white rounded-2xl p-6">
      <AppointmentForm
        initialData={localFormData}
        onSubmit={handleAddAppointment}
        onClose={onClose}
        selectedDateRange={selectedDateRange}
        isSubmitting={addAppointmentLoading}
        submitButtonText="Add Appointment"
        loading={removeAppointmentLoading}
        showAutocomplete={true}
      />
      {appointmentsError && (
        <p className="text-red-500 text-sm mt-2">{appointmentsError}</p>
      )}
    </div>
  );
};

export default AddAppointmentForm;
