import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CalendarForm from "../CalendarForm";
import { CalendarConfig } from "@/components/Dashboard/types";

const mockCalendars: CalendarConfig[] = [
  {
    scheduleId: 1,
    userId: 1,
    view: "dayGridMonth",
    weekends: true,
    slotMinTime: "08:00:00",
    slotMaxTime: "18:00:00",
    blockedDays: ["2022-01-01", "2022-01-02"],
  },
  {
    scheduleId: 2,
    userId: 2,
    view: "dayGridMonth",
    weekends: false,
    slotMinTime: "08:00:00",
    slotMaxTime: "18:00:00",
    blockedDays: ["2022-01-01", "2022-01-02"],
  },
];

vi.mock("@/hooks/useCalendars", () => ({
  default: () => ({ calendars: mockCalendars }),
}));

describe("CalendarForm", () => {
  const initialData: CalendarConfig = {
    scheduleId: 0,
    userId: 0,
    view: "dayGridMonth",
    weekends: true,
    slotMinTime: "08:00:00",
    slotMaxTime: "18:00:00",
    blockedDays: [],
  };

  const onSubmit = vi.fn();
  const onClose = vi.fn();

  it("renders form fields correctly", () => {
    render(
      <CalendarForm
        initialData={initialData}
        onSubmit={onSubmit}
        onClose={onClose}
        isSubmitting={false}
        submitButtonText="Create Schedule"
      />
    );

    expect(screen.getByText("Create Schedule")).toBeInTheDocument();
    expect(screen.getByText("Start time")).toBeInTheDocument();
    expect(screen.getByText("End time")).toBeInTheDocument();
    expect(screen.getByText("Include weekends")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Schedule" })
    ).toBeInTheDocument();
  });
});
