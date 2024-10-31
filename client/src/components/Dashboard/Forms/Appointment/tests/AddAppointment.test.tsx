import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AppointmentForm from "../AppointmentForm";
import { Appointment } from "@/components/Dashboard/types";

const mockPatients = [
  {
    patientId: 1,
    firstName: "John",
    lastName: "Doe",
    contactNumber: "123456789",
  },
  {
    patientId: 2,
    firstName: "Jane",
    lastName: "Smith",
    contactNumber: "987654321",
  },
];

vi.mock("@/hooks/usePatients", () => ({
  default: () => ({ patients: mockPatients }),
}));

describe("AppointmentForm", () => {
  const initialData: Appointment = {
    id: 0,
    scheduleId: 0,
    userId: 0,
    title: "Test Appointment",
    start: new Date(),
    end: new Date(),
    patient: { patientId: 0, firstName: "", lastName: "", contactNumber: "" },
    email: "",
    notes: "",
  };

  const selectedDateRange = { start: new Date(), end: new Date() };

  const onSubmit = vi.fn();

  it("renders form fields correctly", () => {
    render(
      <AppointmentForm
        initialData={initialData}
        onSubmit={onSubmit}
        isSubmitting={false}
        loading={false}
        submitButtonText="Add Appointment"
        showAutocomplete={true}
        selectedDateRange={selectedDateRange}
        isEditing={false}
      />
    );

    fireEvent.click(screen.getByLabelText("Show patient input fields"));

    expect(screen.getByText("Search for a patient")).toBeInTheDocument();
    expect(screen.getByText("Appointment title")).toBeInTheDocument();
    expect(screen.getByText("First name")).toBeInTheDocument();
    expect(screen.getByText("Last name")).toBeInTheDocument();
    expect(screen.getByText("Phone number")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Add Appointment")).toBeInTheDocument();
  });

  it("submits form data correctly", async () => {
    render(
      <AppointmentForm
        initialData={initialData}
        onSubmit={onSubmit}
        isSubmitting={false}
        loading={false}
        submitButtonText="Add Appointment"
        showAutocomplete={true}
        selectedDateRange={selectedDateRange}
        isEditing={false}
      />
    );

    fireEvent.click(screen.getByLabelText("Show patient input fields"));

    fireEvent.change(screen.getByLabelText(/Appointment title/i), {
      target: { value: "Doctor Visit" },
    });
    fireEvent.change(screen.getByLabelText(/First name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Phone number/i), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: "Bring medical reports" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Add Appointment/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Doctor Visit",
          patient: expect.objectContaining({
            firstName: "John",
            lastName: "Doe",
            contactNumber: "123456789",
          }),
          email: "john.doe@example.com",
          notes: "Bring medical reports",
        })
      )
    );
  });
});
