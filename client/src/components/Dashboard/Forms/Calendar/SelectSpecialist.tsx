import type { ScheduleWithUser } from "@mono/server/src/shared/entities";

interface SelectSpecialistProps {
  schedules: ScheduleWithUser[];
  handleSelectedScheduleById: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  selectedScheduleId: number | null;
}

const SelectSpecialist: React.FC<SelectSpecialistProps> = ({
  schedules,
  handleSelectedScheduleById,
  selectedScheduleId,
}) => {
  return (
    <div className="pb-8 w-full">
      <select
        value={selectedScheduleId !== null ? selectedScheduleId.toString() : ""}
        onChange={handleSelectedScheduleById}
        className="transition-all h-12 bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm rounded-lg w-full px-2 focus:outline-none border-r-8 border-transparent"
      >
        {schedules.map((schedule: ScheduleWithUser) => (
          <option
            key={schedule.scheduleId}
            value={schedule.scheduleId.toString()}
          >
            {`${schedule.user.firstName} ${schedule.user.lastName} (${schedule.user.email}) Schedule`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectSpecialist;
