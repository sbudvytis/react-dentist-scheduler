import { useState } from "react";
import { DateSelectArg } from "@fullcalendar/core/index.js";

const useModal = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectInfo, setSelectInfo] = useState<DateSelectArg | null>(null);

  const handleAddAppointmentClose = () => {
    if (selectInfo) {
      selectInfo.view.calendar.unselect();
    }
    setIsAddModalOpen(false);
    setSelectInfo(null);
  };

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    selectInfo,
    setSelectInfo,
    handleAddAppointmentClose,
  };
};

export default useModal;
