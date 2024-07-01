import { useContext } from "react";
import { SelectedScheduleContext } from "@/contexts/ScheduleContext";

export const useSelectedSchedule = () => {
  const context = useContext(SelectedScheduleContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedSchedule must be used within a SelectedScheduleProvider"
    );
  }
  return context;
};
