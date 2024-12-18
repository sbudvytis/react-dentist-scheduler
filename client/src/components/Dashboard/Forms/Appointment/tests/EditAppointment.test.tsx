import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditAppointmentForm from "@/components/Dashboard/Forms/Appointment/EditAppointmentForm";
import { QueryClient, QueryClientProvider } from "react-query";
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

// Mock `window.scrollTo` for tests
Object.defineProperty(window, "scrollTo", { value: () => {}, writable: true });

vi.mock("@/hooks/usePatients", () => ({
  default: () => ({ patients: mockPatients }),
}));

vi.mock("@/hooks/useSelectedSchedule", () => ({
  useSelectedSchedule: () => ({ selectedScheduleId: 1 }),
}));

const removeAppointmentMock = vi.fn();

vi.mock("@/hooks/useAppointment", () => ({
  default: () => ({
    removeAppointment: removeAppointmentMock,
  }),
}));

describe("EditAppointmentForm", () => {
  const queryClient = new QueryClient();

  const appointment: Appointment = {
    id: 1,
    scheduleId: 1,
    userId: 1,
    title: "Test Appointment",
    start: new Date(),
    end: new Date(),
    patient: {
      patientId: 1,
      firstName: "John",
      lastName: "Doe",
      contactNumber: "123456789",
    },
    email: "john.doe@example.com",
    notes: "Initial notes",
  };

  const selectedDateRange = { start: new Date(), end: new Date() };

  const editAppointment = vi.fn();
  const onClose = vi.fn();

  it("renders form fields correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EditAppointmentForm
          appointment={appointment}
          selectedDateRange={selectedDateRange}
          isOpen={true}
          onClose={onClose}
          editAppointment={editAppointment}
          scheduleId={1}
        />
      </QueryClientProvider>
    );

    expect(screen.getByText("Appointment title")).toBeInTheDocument();
    expect(screen.getByText("First name")).toBeInTheDocument();
    expect(screen.getByText("Last name")).toBeInTheDocument();
    expect(screen.getByText("Phone number")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("submits form data correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EditAppointmentForm
          appointment={appointment}
          selectedDateRange={selectedDateRange}
          isOpen={true}
          onClose={onClose}
          editAppointment={editAppointment}
          scheduleId={1}
        />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/Appointment title/i), {
      target: { value: "Updated Appointment" },
    });
    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: "Updated notes" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() =>
      expect(editAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Updated Appointment",
          notes: "Updated notes",
        })
      )
    );
  });

  it("deletes the appointment correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EditAppointmentForm
          appointment={appointment}
          selectedDateRange={selectedDateRange}
          isOpen={true}
          onClose={onClose}
          editAppointment={editAppointment}
          scheduleId={1}
        />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("Remove Appointment"));

    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to remove this appointment?")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(removeAppointmentMock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });
});
