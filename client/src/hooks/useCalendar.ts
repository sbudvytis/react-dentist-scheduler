import { useState } from "react";
import { trpc } from "@/trpc";
import { useMutation, useQuery } from "react-query";
import { CalendarConfig } from "@/components/Dashboard/types";
import isDentist from "./useAuth";
import { useSelectedSchedule } from "./useSelectedSchedule";
import useAuth from "./useAuth";

const useCalendar = () => {
  const [removeScheduleError, setRemoveScheduleError] = useState<string | null>(
    null
  );
  const { setSelectedScheduleId } = useSelectedSchedule();
  const { isLoggedIn } = useAuth();

  const {
    data: schedules = { schedules: [] },
    isLoading: schedulesLoading,
    isError: schedulesError,
    refetch,
  } = useQuery(
    "schedules",
    () => trpc.schedule.find.query({ all: true, latest: isDentist }),
    { enabled: isLoggedIn }
  );

  // select schedule by id
  const selectScheduleById = (scheduleId: number | null) => {
    return schedules.schedules.find(
      (schedule: CalendarConfig) => schedule.scheduleId === scheduleId
    );
  };

  // add schedule
  const addCalendarMutation = useMutation(
    (calendarConfig: CalendarConfig) =>
      trpc.schedule.create.mutate(calendarConfig),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error: unknown) => {
        console.error("Error adding calendar:", error);
      },
    }
  );

  const addCalendar = (calendarConfig: CalendarConfig) => {
    addCalendarMutation.mutate(calendarConfig);
  };

  // edit schedule
  const editCalendarMutation = useMutation(
    (calendarConfig: CalendarConfig) =>
      trpc.schedule.edit.mutate(calendarConfig),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error: unknown) => {
        console.error("Error editing calendar:", error);
      },
    }
  );

  const editCalendar = (calendarConfig: CalendarConfig) => {
    editCalendarMutation.mutate(calendarConfig);
  };

  // remove schedule
  const removeScheduleMutation = useMutation(
    (calendarConfig: CalendarConfig) =>
      trpc.schedule.remove.mutate(calendarConfig),
    {
      onSuccess: () => {
        setSelectedScheduleId(null);
        refetch();
        setRemoveScheduleError(null);
      },
      onError: (error: unknown) => {
        console.error("Error removing schedule:", error);
        setRemoveScheduleError(
          "Cannot remove schedule with existing appointments."
        );
      },
    }
  );

  const removeSchedule = (calendarConfig: CalendarConfig) => {
    if (schedules.schedules.length > 0) {
      return removeScheduleMutation.mutateAsync(calendarConfig);
    }
    return Promise.resolve();
  };

  return {
    schedules: schedules.schedules || [],
    selectScheduleById,
    schedulesLoading,
    schedulesError,
    addCalendar,
    editCalendar,
    removeSchedule,
    addCalendarLoading: addCalendarMutation.isLoading,
    addCalendarError: addCalendarMutation.error,
    removeScheduleError,
  };
};

export default useCalendar;
