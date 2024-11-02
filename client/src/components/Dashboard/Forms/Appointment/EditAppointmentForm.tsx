import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/react";
import showToast from "@/utils/showToast";
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
  editAppointment: (appointment: Appointment) => Promise<void>;
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    setFormData({
      ...appointment,
      start: new Date(appointment.start),
      end: new Date(appointment.end),
    });
  }, [appointment]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await removeAppointment(formData);
      showToast("success", "Appointment removed successfully!");
      onClose();
    } catch (error) {
      showToast("error", "Failed to remove appointment!");
      console.error("Error removing appointment:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (updatedAppointment: Appointment) => {
    setAddLoading(true);
    try {
      await editAppointment(updatedAppointment);
      showToast("success", "Appointment updated successfully!");
      onClose();
    } catch (error) {
      showToast("error", "Failed to update appointment!");
      console.error("Error updating appointment:", error);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      scrollBehavior="normal"
      placement="top-center"
      radius="lg"
      size="4xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-2xl">
          Edit Appointment
        </ModalHeader>
        <ModalBody>
          <AppointmentForm
            initialData={formData}
            selectedDateRange={selectedDateRange}
            onSubmit={handleSubmit}
            isSubmitting={addLoading}
            loading={deleteLoading}
            submitButtonText="Save Changes"
            showDeleteButton
            showAutocomplete={false}
            isEditing={true}
            onDelete={handleDelete}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditAppointmentForm;
