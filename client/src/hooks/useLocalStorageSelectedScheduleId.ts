import { useEffect } from "react";
import { CalendarConfig } from "@/components/Dashboard/types";

const useLocalStorageSelectedScheduleId = (
  schedules: CalendarConfig[],
  selectedScheduleId: number | null,
  setSelectedScheduleId: (id: number) => void
) => {
  useEffect(() => {
    if (schedules.length > 0) {
      const savedScheduleId = localStorage.getItem("selectedScheduleId");
      setSelectedScheduleId(
        savedScheduleId &&
          schedules.some(
            (schedule) => schedule.scheduleId === parseInt(savedScheduleId)
          )
          ? parseInt(savedScheduleId)
          : schedules[0].scheduleId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules]);

  useEffect(() => {
    if (selectedScheduleId !== null) {
      localStorage.setItem("selectedScheduleId", selectedScheduleId.toString());
    }
  }, [selectedScheduleId]);
};

export default useLocalStorageSelectedScheduleId;
