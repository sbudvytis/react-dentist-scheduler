import { useEffect, useState } from "react";
import useAppointments from "@/hooks/useAppointment";
import { Appointment } from "@/components/Dashboard/types";

const useTodayAppointments = (selectedScheduleId: number | null) => {
  const { appointments, getTodaysAppointments } =
    useAppointments(selectedScheduleId);
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>(
    []
  );

  useEffect(() => {
    // Checking if the appointments array has changed before updating the state
    if (JSON.stringify(appointments) !== JSON.stringify(todaysAppointments)) {
      const todayAppointments = getTodaysAppointments(appointments);
      setTodaysAppointments(todayAppointments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  return { todaysAppointments };
};

export default useTodayAppointments;
