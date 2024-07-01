import React, { createContext, useState, ReactNode } from "react";

interface SelectedScheduleContextProps {
  selectedScheduleId: number | null;
  setSelectedScheduleId: (id: number | null) => void;
  resetSelectedScheduleId: () => void;
}

export const SelectedScheduleContext = createContext<
  SelectedScheduleContextProps | undefined
>(undefined);

export const SelectedScheduleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedScheduleId, setSelectedScheduleIdState] = useState<
    number | null
  >(null);

  const setSelectedScheduleId = (id: number | null) => {
    console.log("Setting selectedScheduleId:", id);
    setSelectedScheduleIdState(id);
  };

  const resetSelectedScheduleId = () => {
    console.log("Resetting selectedScheduleId");
    setSelectedScheduleIdState(null);
  };

  return (
    <SelectedScheduleContext.Provider
      value={{
        selectedScheduleId,
        setSelectedScheduleId,
        resetSelectedScheduleId,
      }}
    >
      {children}
    </SelectedScheduleContext.Provider>
  );
};
