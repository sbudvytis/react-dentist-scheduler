import useDisabledPeriod from "@/hooks/useDisabledPeriod";
import { DisabledPeriod } from "@/components/Dashboard/types";

type MyDisabledPeriodProps = {
  scheduleId: number | null;
};

const MyDisabledPeriod: React.FC<MyDisabledPeriodProps> = ({ scheduleId }) => {
  const { disabledPeriods, disabledPeriodLoading, removeDisabledPeriod } =
    useDisabledPeriod(scheduleId);

  const removeDisabledPeriodHandler = async (
    disabledPeriod: DisabledPeriod
  ) => {
    try {
      await removeDisabledPeriod(disabledPeriod);
    } catch (error) {
      console.error("Error removing disabled period:", error);
    }
  };

  return (
    <div>
      <h1>Disabled Periods</h1>
      {disabledPeriodLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {disabledPeriods?.map((period) => {
            const startDate = new Date(period.startDate);
            const endDate = new Date(period.endDate);

            const formattedStartDate = startDate.toLocaleDateString("en-GB", {
              weekday: "short",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });

            const formattedEndDate = endDate.toLocaleDateString("en-GB", {
              weekday: "short",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });

            return (
              <li key={`${period.startDate}-${period.endDate}`}>
                {formattedStartDate} - {formattedEndDate} - {period.reason}
                <button onClick={() => removeDisabledPeriodHandler(period)}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyDisabledPeriod;
