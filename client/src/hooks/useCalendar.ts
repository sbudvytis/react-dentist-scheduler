import { useState } from "react";
import { trpc } from "@/trpc";
import { useMutation, useQuery } from "react-query";
import { CalendarConfig } from "@/components/Dashboard/types";
import { useSelectedSchedule } from "./useSelectedSchedule";
import useAuth from "./useAuth";

const useCalendar = () => {
  const [removeScheduleError, setRemoveScheduleError] = useState<string | null>(
    null
  );
  const { setSelectedScheduleId } = useSelectedSchedule();
  const { isLoggedIn } = useAuth();

  // Fetch schedules
  const {
    data: schedules = { schedules: [] },
    isLoading: schedulesLoading,
    isError: schedulesError,
    refetch,
  } = useQuery("schedules", () => trpc.schedule.find.query({ all: true }), {
    enabled: isLoggedIn,
  });

  // Select schedule by ID
  const selectScheduleById = (scheduleId: number | null) => {
    return schedules.schedules.find(
      (schedule: CalendarConfig) => schedule.scheduleId === scheduleId
    );
  };

  // Add schedule mutation
  const addCalendarMutation = useMutation(
    (calendarConfig: CalendarConfig) =>
      trpc.schedule.create.mutate(calendarConfig),
    {
      onSuccess: () => {
        refetch(); // Refetch schedules after successful addition
      },
      onError: (error: unknown) => {
        console.error("Error adding calendar:", error);
      },
    }
  );

  // Use `mutateAsync` to await the mutation in the form component
  const addCalendar = async (calendarConfig: CalendarConfig) => {
    try {
      await addCalendarMutation.mutateAsync(calendarConfig); // Use async version to await completion
    } catch (error) {
      console.error("Error adding calendar:", error);
    }
  };

  // Edit schedule mutation
  const editCalendarMutation = useMutation(
    (calendarConfig: CalendarConfig) =>
      trpc.schedule.edit.mutate(calendarConfig),
    {
      onSuccess: () => {
        refetch(); // Refetch schedules after successful edit
      },
      onError: (error: unknown) => {
        console.error("Error editing calendar:", error);
      },
    }
  );

  // Use `mutateAsync` for edit as well
  const editCalendar = async (calendarConfig: CalendarConfig) => {
    try {
      await editCalendarMutation.mutateAsync(calendarConfig); // Await for better control
    } catch (error) {
      console.error("Error editing calendar:", error);
    }
  };

  // Remove schedule mutation
  const removeScheduleMutation = useMutation(
    (calendarConfig: CalendarConfig) =>
      trpc.schedule.remove.mutate(calendarConfig),
    {
      onSuccess: () => {
        setSelectedScheduleId(null); // Reset selected schedule on success
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

  const removeSchedule = async (calendarConfig: CalendarConfig) => {
    if (schedules.schedules.length > 0) {
      return await removeScheduleMutation.mutateAsync(calendarConfig); // Use async version for consistency
    }
    return Promise.resolve();
  };

  return {
    schedules: schedules.schedules || [],
    selectScheduleById,
    schedulesLoading,
    schedulesError,
    addCalendar, // Now async, you can await it in components
    editCalendar, // Now async as well
    removeSchedule,
    addCalendarLoading: addCalendarMutation.isLoading,
    addCalendarError: addCalendarMutation.error,
    editCalendarLoading: editCalendarMutation.isLoading,
    editCalendarError: editCalendarMutation.error,
    removeScheduleError,
  };
};

export default useCalendar;
