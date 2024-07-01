import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { Appointment } from "@/components/Dashboard/types";
import AppointmentForm from "./AppointmentForm";
import useAppointments from "@/hooks/useAppointment";
import { useSelectedSchedule } from "@/hooks/useSelectedSchedule";

interface EditAppointmentFormProps {
  appointment: Appointment;
  selectedDateRange: { start: Date; end: Date };
  isOpen: boolean;
  scheduleId: number | null;
  onClose: () => void;
  editAppointment: (appointment: Appointment) => void;
}

const EditAppointmentForm = ({
  appointment,
  selectedDateRange,
  isOpen,
  onClose,
  editAppointment,
}: EditAppointmentFormProps) => {
  const [formData, setFormData] = useState<Appointment>({
    ...appointment,
    start: new Date(appointment.start),
    end: new Date(appointment.end),
  });

  const { selectedScheduleId } = useSelectedSchedule();
  const { removeAppointment } = useAppointments(selectedScheduleId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      ...appointment,
      start: new Date(appointment.start),
      end: new Date(appointment.end),
    });
  }, [appointment]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await removeAppointment(formData);
      onClose();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody>
          <div className="sm:mx-auto sm:w-full sm:max-w-lg bg-white rounded-2xl p-6">
            <AppointmentForm
              initialData={formData}
              selectedDateRange={selectedDateRange}
              onSubmit={(updatedAppointment) => {
                editAppointment(updatedAppointment);
                onClose();
              }}
              onClose={onClose}
              isSubmitting={false}
              loading={loading}
              submitButtonText="Save Changes"
              showDeleteButton
              showAutocomplete={false}
              onDelete={handleDelete}
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditAppointmentForm;
