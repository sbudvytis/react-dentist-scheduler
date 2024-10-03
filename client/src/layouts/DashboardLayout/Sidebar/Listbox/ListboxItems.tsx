import { useState } from "react";
import { cn, Spinner } from "@nextui-org/react";
import ModalComponent from "./Modal";
import AddAppointmentForm from "@/components/Dashboard/Forms/Appointment/AddAppointmentForm";
import AddCalendarForm from "@/components/Dashboard/Forms/Calendar/AddCalendarForm";
import RemoveSchedule from "@/components/Dashboard/Forms/Calendar/RemoveCalendar";
import useAuth from "@/hooks/useAuth";
import EditCalendarForm from "@/components/Dashboard/Forms/Calendar/EditCalendarForm";
import { useSelectedSchedule } from "@/hooks/useSelectedSchedule";

import {
  IoTodayOutline,
  IoTrashBinOutline,
  IoCalendarClearOutline,
  IoCalendarOutline,
} from "react-icons/io5";

type Props = {
  hasSchedule: boolean;
  isLoading: boolean;
};

interface ModalContentMap {
  [key: string]: React.ReactElement;
}

const ListboxItems = ({ hasSchedule, isLoading }: Props) => {
  const iconClasses = "text-lg pointer-events-none flex-shrink-0";

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { selectedScheduleId } = useSelectedSchedule();
  const { isDentist } = useAuth();

  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const modalContent: ModalContentMap = {
    addAppointment: (
      <AddAppointmentForm
        scheduleId={selectedScheduleId}
        onClose={closeModal}
        selectedDateRange={{ start: new Date(), end: new Date() }}
      />
    ),
    createSchedule: <AddCalendarForm onClose={closeModal} />,
    editSchedule: (
      <EditCalendarForm onClose={closeModal} scheduleId={selectedScheduleId} />
    ),
    removeSchedule: <RemoveSchedule onClose={closeModal} />,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner color="default" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-4 px-2 py-2 text-sm text-gray-500">
        {hasSchedule && (
          <>
            <button
              onClick={() => openModal("addAppointment")}
              className="flex items-center space-x-4 hover:text-gray-800 focus:outline-none"
            >
              <IoTodayOutline className={iconClasses} />
              <span>Create appointment</span>
            </button>

            {isDentist && (
              <>
                <button
                  onClick={() => openModal("editSchedule")}
                  className="flex items-center space-x-4 hover:text-gray-800 focus:outline-none"
                >
                  <IoCalendarClearOutline className={iconClasses} />
                  <span>Edit schedule</span>
                </button>

                <button
                  onClick={() => openModal("removeSchedule")}
                  className={cn(
                    "flex items-center space-x-4 hover:text-gray-800 focus:outline-none"
                  )}
                >
                  <IoTrashBinOutline className={iconClasses} />
                  <span>Remove schedule</span>
                </button>
              </>
            )}
          </>
        )}

        {!hasSchedule && isDentist && (
          <button
            onClick={() => openModal("createSchedule")}
            className="flex items-center space-x-4 hover:text-gray-800 focus:outline-none"
          >
            <IoCalendarOutline className={iconClasses} />
            <span>Create schedule</span>
          </button>
        )}
      </div>

      {activeModal && (
        <ModalComponent
          isOpen={true}
          onClose={closeModal}
          content={modalContent[activeModal]}
          scrollBehavior="inside"
        />
      )}
    </>
  );
};

export default ListboxItems;
