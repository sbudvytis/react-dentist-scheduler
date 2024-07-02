import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { toast } from "react-toastify";
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
      toast.success("Appointment removed successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to remove appointment.");
      console.error("Error removing appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (updatedAppointment: Appointment) => {
    try {
      editAppointment(updatedAppointment);
      toast.success("Appointment updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update appointment.");
      console.error("Error updating appointment:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalBody>
          <div className="sm:mx-auto sm:w-full sm:max-w-lg p-6">
            <AppointmentForm
              initialData={formData}
              selectedDateRange={selectedDateRange}
              onSubmit={handleSubmit}
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
