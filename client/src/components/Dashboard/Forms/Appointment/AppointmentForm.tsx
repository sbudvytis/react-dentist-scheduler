import { useState, useEffect } from "react";
import {
  Input,
  Textarea,
  Button,
  DatePicker,
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@nextui-org/react";
import { ZonedDateTime, parseAbsoluteToLocal } from "@internationalized/date";
import { Appointment, Patient } from "@/components/Dashboard/types";
import usePatients from "@/hooks/usePatients";
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";

interface AppointmentFormProps {
  initialData: Appointment;
  onSubmit: (appointmentData: Appointment) => void;
  onClose: () => void;
  onDelete?: () => void;
  selectedDateRange: { start: Date; end: Date };
  isSubmitting: boolean;
  loading: boolean;
  showDeleteButton?: boolean;
  submitButtonText: string;
  showAutocomplete: boolean;
  isEditing: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
  loading,
  submitButtonText,
  showDeleteButton = false,
  onDelete,
  showAutocomplete,
  isEditing,
}) => {
  const [formData, setFormData] = useState<Appointment>({
    ...initialData,
    start: new Date(initialData.start),
    end: new Date(initialData.end),
    patient: initialData.patient,
  });

  const { patients } = usePatients(0, 0, "");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false); // New state to control visibility

  useEffect(() => {
    setFormData({
      ...initialData,
      start: new Date(initialData.start),
      end: new Date(initialData.end),
      patient: initialData.patient,
    });
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      patient: {
        ...prev.patient,
        [name]: value,
      },
    }));
  };

  const handleDateChange = (name: string) => (value: ZonedDateTime) => {
    setFormData((prev) => ({ ...prev, [name]: value.toDate() }));
  };

  const handlePatientSelect = (key: React.Key | null) => {
    const selectedPatient = patients.find(
      (patient: Patient) => patient.patientId.toString() === key
    );
    if (selectedPatient) {
      setFormData((prev) => ({
        ...prev,
        patient: {
          ...prev.patient,
          firstName: selectedPatient.firstName,
          lastName: selectedPatient.lastName,
          contactNumber: selectedPatient.contactNumber,
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    closeDeleteModal();
  };

  return (
    <div className="py-4">
      <form onSubmit={handleSubmit} className="grid space-y-4">
        <div className="flex gap-3">
          {showAutocomplete && !isEditing && (
            <div className="w-full">
              <Autocomplete
                label="Search for a patient"
                radius="lg"
                size="sm"
                description="Search by name or add a new patient"
                onSelectionChange={handlePatientSelect}
              >
                {patients.map((patient: Patient) => (
                  <AutocompleteItem key={patient.patientId.toString()}>
                    {`${patient.firstName} ${patient.lastName}`}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          )}
          {!isEditing && (
            <div>
              <Tooltip
                content="Add new patient"
                radius="sm"
                className="bg-black text-white"
              >
                <Button
                  isIconOnly
                  variant="flat"
                  radius="lg"
                  size="lg"
                  aria-label={
                    showPatientForm
                      ? "Hide patient input fields"
                      : "Show patient input fields"
                  }
                  onClick={() => setShowPatientForm(!showPatientForm)}
                >
                  {showPatientForm ? (
                    <IoPersonRemoveOutline />
                  ) : (
                    <IoPersonAddOutline />
                  )}
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        {(showPatientForm || isEditing) && (
          <>
            <div className="flex gap-3">
              <div className="w-full">
                <Input
                  type="text"
                  label="First name"
                  name="firstName"
                  isRequired
                  radius="lg"
                  size="sm"
                  value={formData.patient.firstName}
                  onChange={handlePatientDataChange}
                  required
                />
              </div>
              <div className="w-full">
                <Input
                  type="text"
                  label="Last name"
                  name="lastName"
                  isRequired
                  radius="lg"
                  size="sm"
                  value={formData.patient.lastName}
                  onChange={handlePatientDataChange}
                  required
                />
              </div>
            </div>
            <div>
              <Input
                type="text"
                label="Phone number"
                name="contactNumber"
                isRequired
                radius="lg"
                size="sm"
                value={formData.patient.contactNumber}
                onChange={handlePatientDataChange}
                required
              />
            </div>
          </>
        )}
        <div>
          <Input
            type="text"
            label="Appointment title"
            name="title"
            isRequired
            radius="lg"
            size="sm"
            value={formData.title}
            onChange={handleInputChange}
            autoFocus
            required
          />
        </div>
        <div>
          <Input
            type="email"
            label="Email"
            name="email"
            isRequired
            radius="lg"
            size="sm"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col md:flex-row w-full gap-3">
          <div className="w-full">
            <DatePicker
              hourCycle={24}
              label="Start"
              variant="flat"
              hideTimeZone
              isRequired
              radius="lg"
              size="sm"
              description="dd/mm/yyyy, hh:mm format"
              value={parseAbsoluteToLocal(formData.start.toISOString())}
              onChange={handleDateChange("start")}
            />
          </div>
          <div className="w-full">
            <DatePicker
              hourCycle={24}
              label="End"
              variant="flat"
              hideTimeZone
              isRequired
              radius="lg"
              size="sm"
              description="dd/mm/yyyy, hh:mm format"
              value={parseAbsoluteToLocal(formData.end.toISOString())}
              onChange={handleDateChange("end")}
            />
          </div>
        </div>
        <div>
          <Textarea
            label="Notes"
            name="notes"
            isRequired
            required
            radius="lg"
            size="sm"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>

        {/* Form actions */}
        <div className="flex justify-center gap-2 lg:justify-end">
          <Button
            type="submit"
            variant="solid"
            radius="lg"
            disabled={isSubmitting}
            className="border-none shadow-gray-100 bg-black hover:bg-indigo-600 text-white h-9"
          >
            {isSubmitting ? "Processing..." : submitButtonText}
          </Button>

          {showDeleteButton && (
            <Button
              color="danger"
              variant="flat"
              radius="lg"
              onClick={openDeleteModal}
              className="h-9"
            >
              {loading ? "Removing..." : "Remove Appointment"}
            </Button>
          )}
        </div>
      </form>

      {/* Modal for delete confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        scrollBehavior="normal"
        placement="top-center"
        radius="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-2xl">
            Confirmation
          </ModalHeader>
          <ModalBody>
            Are you sure you want to remove this appointment?
          </ModalBody>
          <ModalFooter className="flex justify-center gap-2 lg:justify-end">
            <Button
              color="default"
              variant="solid"
              radius="lg"
              onClick={closeDeleteModal}
              className="border-none shadow-gray-100 bg-black hover:bg-indigo-600 text-white h-9"
            >
              Cancel
            </Button>
            <Button
              color="danger"
              variant="flat"
              radius="lg"
              onClick={confirmDelete}
              className="h-9"
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AppointmentForm;
