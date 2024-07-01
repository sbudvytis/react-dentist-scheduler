import React, { useState, useEffect } from "react";
import {
  Input,
  Textarea,
  Button,
  DatePicker,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { ZonedDateTime, parseAbsoluteToLocal } from "@internationalized/date";
import { Appointment, Patient } from "@/components/Dashboard/types";
import usePatients from "@/hooks/usePatients";

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
  showAutocomplete: boolean; // New prop to control autocomplete visibility
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
}) => {
  const [formData, setFormData] = useState<Appointment>({
    ...initialData,
    start: new Date(initialData.start),
    end: new Date(initialData.end),
    patient: initialData.patient,
  });

  const { patients } = usePatients();

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

  return (
    <form onSubmit={handleSubmit} className="grid space-y-4">
      <div className="pb-4 flex-col space-y-2">
        <h1 className="text-3xl font-semibold">
          {submitButtonText === "Add Appointment"
            ? "Create an Appointment"
            : "Edit Appointment"}
        </h1>
      </div>

      {showAutocomplete && (
        <div className="w-full">
          <Autocomplete
            label="Search for a patient"
            description="Search for a patient by name or create a new down below"
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
      <div>
        <Input
          type="text"
          label="Appointment title"
          name="title"
          isRequired
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="flex gap-3">
        <div className="w-full">
          <Input
            type="text"
            label="First name"
            name="firstName"
            isRequired
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
          value={formData.patient.contactNumber}
          onChange={handlePatientDataChange}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          label="Email"
          name="email"
          isRequired
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <DatePicker
          hourCycle={24}
          label="Start"
          variant="flat"
          hideTimeZone
          showMonthAndYearPickers
          isRequired
          value={parseAbsoluteToLocal(formData.start.toISOString())}
          onChange={handleDateChange("start")}
        />
      </div>
      <div>
        <DatePicker
          hourCycle={24}
          label="End"
          variant="flat"
          hideTimeZone
          showMonthAndYearPickers
          isRequired
          value={parseAbsoluteToLocal(formData.end.toISOString())}
          onChange={handleDateChange("end")}
        />
      </div>
      <div>
        <Textarea
          label="Notes"
          name="notes"
          isRequired
          value={formData.notes}
          onChange={handleInputChange}
        />
      </div>
      <Button type="submit" variant="bordered" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : submitButtonText}
      </Button>

      {showDeleteButton && (
        <Button
          type="button"
          variant="bordered"
          color="danger"
          onClick={onDelete}
          className="mt-2"
        >
          {loading ? "Removing..." : "Remove Appointment"}
        </Button>
      )}
    </form>
  );
};

export default AppointmentForm;
