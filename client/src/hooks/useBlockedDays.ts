import { trpc } from "@/trpc";
import { useMutation, useQuery } from "react-query";
import { BlockedPeriod } from "@/components/Dashboard/types";
import showToast from "@/utils/showToast";

const useBlockedDays = (scheduleId: number | null) => {
  const {
    data: blockedPeriods,
    isLoading: blockedDaysLoading,
    refetch,
  } = useQuery(
    ["blockedPeriods", scheduleId],
    async () => {
      if (scheduleId === null) {
        throw new Error("scheduleId cannot be null.");
      }
      return await trpc.blockedPeriod.find.query({ scheduleId });
    },
    {
      enabled: !!scheduleId,
    }
  );

  const addBlockedPeriodMutation = useMutation(
    (blockedPeriodData: BlockedPeriod) => {
      if (scheduleId === null) {
        throw new Error("scheduleId cannot be null.");
      }
      return trpc.blockedPeriod.create.mutate({
        ...blockedPeriodData,
        scheduleId,
      });
    },
    {
      onSuccess: () => {
        refetch();
        showToast("success", "Blocked period added successfully!");
      },
      onError: (error: unknown) => {
        console.error("Error creating blocked days period:", error);
      },
    }
  );

  // Add appointment with async/await
  const createBlockedPeriod = async (blockedPeriodData: BlockedPeriod) => {
    try {
      await addBlockedPeriodMutation.mutateAsync(blockedPeriodData);
    } catch (error) {
      console.error("Error creating blocked days period:", error);
    }
  };

  return {
    blockedPeriods,
    blockedDaysLoading,
    createBlockedPeriod,
    addBlockedDaysLoading: addBlockedPeriodMutation.isLoading,
    addAppointmentError: addBlockedPeriodMutation.error,
  };
};

export default useBlockedDays;
