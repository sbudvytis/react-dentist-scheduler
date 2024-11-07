import { trpc } from "@/trpc";
import { useMutation, useQuery } from "react-query";
import { DisabledPeriod } from "@/components/Dashboard/types";
import showToast from "@/utils/showToast";

const useDisabledPeriod = (scheduleId: number | null) => {
  const {
    data: disabledPeriods,
    isLoading: disabledPeriodLoading,
    refetch,
  } = useQuery(
    ["disabledPeriods", scheduleId],
    async () => {
      if (scheduleId === null) {
        throw new Error("scheduleId cannot be null.");
      }
      return await trpc.disabledPeriod.find.query({ scheduleId });
    },
    {
      enabled: !!scheduleId,
    }
  );

  const createDisabledPeriodMutation = useMutation(
    (disabledPeriodData: DisabledPeriod) => {
      if (scheduleId === null) {
        throw new Error("scheduleId cannot be null.");
      }
      return trpc.disabledPeriod.create.mutate({
        ...disabledPeriodData,
        scheduleId,
      });
    },
    {
      onSuccess: () => {
        refetch();
        showToast("success", "Successfully reported disabled period!");
      },
      onError: (error: unknown) => {
        console.error("Error creating disabled days period:", error);
      },
    }
  );

  // Add appointment with async/await
  const createDisabledPeriod = async (disabledPeriodData: DisabledPeriod) => {
    try {
      await createDisabledPeriodMutation.mutateAsync(disabledPeriodData);
    } catch (error) {
      console.error("Error creating disabled days period:", error);
    }
  };

  return {
    disabledPeriods,
    disabledPeriodLoading,
    createDisabledPeriod,
    createDisabledPeriodLoading: createDisabledPeriodMutation.isLoading,
    createDisabledPeriodError: createDisabledPeriodMutation.error,
  };
};

export default useDisabledPeriod;
