import { useEffect, useState } from "react";
import showToast from "@/utils/showToast";
import useAddAppointment from "@/hooks/useAppointment";
import useFormDataStore from "@/stores/useAppointmentFormStore";
import AppointmentForm from "./AppointmentForm";
import { Appointment } from "@/components/Dashboard/types";
import { useSelectedSchedule } from "@/hooks/useSelectedSchedule";
import useBlockedDays from "@/hooks/useBlockedDays";

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
  const { addAppointment, addAppointmentLoading, removeAppointmentLoading } =
    useAddAppointment(selectedScheduleId);
  const { blockedPeriods } = useBlockedDays(selectedScheduleId);
  const { formData, setFormData } = useFormDataStore();
  const [localFormData, setLocalFormData] = useState<Appointment>(formData);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      const { start, end } = appointmentData;

      // Check if end time is before start time
      if (end < start) {
        const message = "End time cannot be before start time!";
        setErrorMessage(message);
        showToast("error", message);
        return;
      }

      // Convert blocked periods to Date objects for comparison
      const blockedDates =
        blockedPeriods
          ?.map((period) => {
            const startDate = new Date(period.startDate);
            const endDate = new Date(period.endDate);
            const dates = [];
            for (
              let dt = startDate;
              dt <= endDate;
              dt.setDate(dt.getDate() + 1)
            ) {
              dates.push(dt.toDateString());
            }
            return dates;
          })
          .flat() || []; // Flatten the array of blocked dates

      const isDateBlocked = (date: Date) => {
        return blockedDates.includes(date.toDateString());
      };

      if (isDateBlocked(start) || isDateBlocked(end)) {
        const message = "Cannot create appointment on a disabled date!";
        setErrorMessage(message);
        showToast("error", message);
        return;
      } else {
        setErrorMessage(null);
      }

      try {
        await addAppointment({
          ...appointmentData,
          scheduleId: selectedScheduleId,
        });
        showToast("success", "Appointment created successfully!");
      } catch (error) {
        showToast("error", "Failed to create appointment!");
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
        selectedDateRange={selectedDateRange}
        isSubmitting={addAppointmentLoading}
        submitButtonText="Create Appointment"
        loading={removeAppointmentLoading}
        showAutocomplete={true}
        isEditing={false}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default AddAppointmentForm;
