import React from "react";
import { SelectedScheduleProvider } from "@/contexts/ScheduleContext";

const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <SelectedScheduleProvider>{children}</SelectedScheduleProvider>;
};

export default AppProviders;
