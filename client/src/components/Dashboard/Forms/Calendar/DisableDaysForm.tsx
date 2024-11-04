import React, { useState } from "react";
import useBlockedDays from "@/hooks/useBlockedDays"; // Adjust the import path as necessary
import { BlockedPeriod } from "@/components/Dashboard/types";

const DisableDaysForm = ({ scheduleId }: { scheduleId: number | null }) => {
  const { createBlockedPeriod, addBlockedDaysLoading } =
    useBlockedDays(scheduleId);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const blockedPeriodData: BlockedPeriod = {
      startDate,
      endDate,
      reason,
    };

    await createBlockedPeriod(blockedPeriodData);

    // Reset form fields after submission
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  return (
    <div>
      <h1>Disable Days Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Reason (optional):
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for blocking (e.g., holiday, sick leave)"
            />
          </label>
        </div>
        <button type="submit" disabled={addBlockedDaysLoading}>
          {addBlockedDaysLoading ? "Adding..." : "Add Blocked Days"}
        </button>
      </form>
    </div>
  );
};

export default DisableDaysForm;
