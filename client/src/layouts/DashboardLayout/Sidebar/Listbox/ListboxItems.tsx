import { useState, useEffect } from "react";
import { Button, cn, Spinner } from "@nextui-org/react";
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
  closeMenu: () => void;
};

interface ModalContentMap {
  [key: string]: React.ReactElement;
}

const ListboxItems = ({ hasSchedule, isLoading, closeMenu }: Props) => {
  const iconClasses = "text-lg pointer-events-none flex-shrink-0";
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { selectedScheduleId } = useSelectedSchedule();
  const { isDentist } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobile(isMobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const RemoveScheduleButton = () => (
    <Button
      onClick={() => {
        openModal("removeSchedule");
        closeMenu();
      }}
      color="danger"
      variant="solid"
      size="sm"
      className={cn(
        "flex items-center space-x-2 text-sm focus:outline-none w-full"
      )}
    >
      <IoTrashBinOutline className={iconClasses} />
      <span>Remove schedule</span>
    </Button>
  );

  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)]">
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col space-y-4 px-2 py-2 text-sm text-gray-500">
          {hasSchedule && (
            <>
              <button
                onClick={() => {
                  openModal("addAppointment");
                  closeMenu();
                }}
                className="flex items-center space-x-4 hover:text-gray-800 focus:outline-none"
              >
                <IoTodayOutline className={iconClasses} />
                <span>Create appointment</span>
              </button>

              {isDentist && (
                <button
                  onClick={() => {
                    openModal("editSchedule");
                    closeMenu();
                  }}
                  className="flex items-center space-x-4 hover:text-gray-800 focus:outline-none"
                >
                  <IoCalendarClearOutline className={iconClasses} />
                  <span>Edit schedule</span>
                </button>
              )}
            </>
          )}

          {!hasSchedule && isDentist && (
            <button
              onClick={() => {
                openModal("createSchedule");
                closeMenu();
              }}
              className="flex items-center space-x-4 hover:text-gray-800 focus:outline-none"
            >
              <IoCalendarOutline className={iconClasses} />
              <span>Create schedule</span>
            </button>
          )}
        </div>
      </div>

      {/* Remove Schedule Button for Mobile */}
      {isMobile && hasSchedule && isDentist && (
        <div className="mt-auto px-4 py-4 fixed bottom-0 left-0 right-0 w-72 z-50">
          <RemoveScheduleButton />
        </div>
      )}

      {/* Remove Schedule Button for Desktop */}
      {!isMobile && hasSchedule && isDentist && (
        <div className="mt-auto px-2 py-4">
          <RemoveScheduleButton />
        </div>
      )}

      {activeModal && (
        <ModalComponent
          isOpen={true}
          onClose={closeModal}
          content={modalContent[activeModal]}
          scrollBehavior="inside"
        />
      )}
    </div>
  );
};

export default ListboxItems;
