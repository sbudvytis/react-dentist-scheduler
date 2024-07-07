import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Card,
  CardBody,
} from "@nextui-org/react";
import useCalendar from "@/hooks/useCalendar";
import useAppointments from "@/hooks/useAppointment";
import { useSelectedSchedule } from "@/hooks/useSelectedSchedule";
import useAuth from "@/hooks/useAuth";
import useLocalStorageSelectedScheduleId from "@/hooks/useLocalStorageSelectedScheduleId";
import useModal from "@/hooks/useModal";
import { Appointment } from "./types";
import Calendar from "./Calendar";
import EditAppointmentForm from "./Forms/Appointment/EditAppointmentForm";
import AddAppointmentForm from "./Forms/Appointment/AddAppointmentForm";
import SelectSpecialist from "./Forms/Calendar/SelectSpecialist";
import LoadingSpinner from "@/views/Spinner";
import "./calendarStyle.css";

const Dashboard = () => {
  const { schedules, schedulesLoading, schedulesError, selectScheduleById } =
    useCalendar();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });
  const { selectedScheduleId, setSelectedScheduleId } = useSelectedSchedule();
  const { canViewAllSchedules } = useAuth();
  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    editAppointment,
  } = useAppointments(selectedScheduleId);

  useLocalStorageSelectedScheduleId(
    schedules,
    selectedScheduleId,
    setSelectedScheduleId
  );

  const {
    isEditModalOpen,
    setIsEditModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,

    setSelectInfo,
    handleAddAppointmentClose,
  } = useModal();

  if ((schedulesLoading || appointmentsLoading) && schedules.length > 0) {
    return <LoadingSpinner />;
  }

  if (schedulesError || (appointmentsError && selectedScheduleId != null)) {
    return <p>Error loading data</p>;
  }

  const handleSelectedScheduleById: React.ChangeEventHandler<
    HTMLSelectElement
  > = (event) => {
    const scheduleId = parseInt(event.target.value);
    if (scheduleId !== selectedScheduleId) {
      setSelectedScheduleId(scheduleId);
    }
  };

  if (schedules.length === 0 && !schedulesLoading) {
    return (
      <Card className="border-none text-default-500" shadow="sm" radius="sm">
        <CardBody className="text-center">
          <p className="relative flex justify-center items-center gap-2">
            You have not created your schedule yet.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {canViewAllSchedules && (
        <SelectSpecialist
          schedules={schedules}
          handleSelectedScheduleById={handleSelectedScheduleById}
          selectedScheduleId={selectedScheduleId}
        />
      )}

      {selectedScheduleId !== null && (
        <Calendar
          config={selectScheduleById(selectedScheduleId)}
          appointments={appointments}
          editAppointment={editAppointment}
          setSelectedAppointment={setSelectedAppointment}
          setIsEditModalOpen={setIsEditModalOpen}
          setSelectedDateRange={setSelectedDateRange}
          setSelectInfo={setSelectInfo}
          setIsAddModalOpen={setIsAddModalOpen}
        />
      )}

      {selectedAppointment && (
        <EditAppointmentForm
          scheduleId={selectedScheduleId}
          appointment={selectedAppointment}
          selectedDateRange={selectedDateRange}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          editAppointment={editAppointment}
        />
      )}

      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={handleAddAppointmentClose}
        radius="sm"
      >
        <ModalContent>
          <ModalBody>
            <AddAppointmentForm
              scheduleId={selectedScheduleId}
              selectedDateRange={selectedDateRange}
              onClose={handleAddAppointmentClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;
