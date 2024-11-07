import React, { useState } from "react";
import useDisabledPeriod from "@/hooks/useDisabledPeriod";
import { DisabledPeriod } from "@/components/Dashboard/types";
import { Button, DatePicker, Input } from "@nextui-org/react";
import { DateValue, today, getLocalTimeZone } from "@internationalized/date"; // Import getLocalTimeZone

interface CreateDisabledPeriodFormProps {
  scheduleId: number | null;
  onClose: () => void;
}

const DisablePeriodForm: React.FC<CreateDisabledPeriodFormProps> = ({
  scheduleId,
  onClose,
}) => {
  const { createDisabledPeriod, createDisabledPeriodLoading } =
    useDisabledPeriod(scheduleId);

  // Get the local timezone
  const timeZone = getLocalTimeZone();

  // Initialize startDate and endDate with today's date and the correct timeZone
  const [startDate, setStartDate] = useState<DateValue>(today(timeZone));
  const [endDate, setEndDate] = useState<DateValue>(today(timeZone));
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      return;
    }

    // Convert DateValue to ISO string for backend
    const blockedPeriodData: DisabledPeriod = {
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      reason,
    };

    await createDisabledPeriod(blockedPeriodData);

    // Reset to today's date with the correct time zone
    setStartDate(today(timeZone));
    setEndDate(today(timeZone));
    setReason("");
    onClose();
  };

  return (
    <div className="py-4">
      <form onSubmit={handleSubmit} className="grid space-y-4">
        <div>
          <DatePicker
            label="Select Start Date"
            value={startDate}
            onChange={setStartDate}
            isRequired
          />
        </div>
        <div>
          <DatePicker
            label="Select End Date"
            value={endDate}
            onChange={setEndDate}
            color="default"
            isRequired
          />
        </div>
        <div>
          <Input
            label="Reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for reporting (e.g., holiday, sick leave)"
          />
        </div>
        <div className="flex justify-center lg:justify-end">
          <Button
            type="submit"
            radius="lg"
            variant="solid"
            disabled={createDisabledPeriodLoading}
            isLoading={createDisabledPeriodLoading}
            className="border-none bg-black hover:bg-indigo-600 text-white h-9"
          >
            Report
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DisablePeriodForm;
