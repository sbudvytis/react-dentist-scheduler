import { Select, SelectItem } from "@nextui-org/react";
import type { ScheduleWithUser } from "@mono/server/src/shared/entities";

interface SelectSpecialistProps {
  schedules: ScheduleWithUser[];
  handleSelectedScheduleById: (value: string | number) => void;
  selectedScheduleId: number | null;
}

const SelectSpecialist: React.FC<SelectSpecialistProps> = ({
  schedules,
  handleSelectedScheduleById,
  selectedScheduleId,
}) => {
  return (
    <div className="pb-8 w-full">
      <Select
        label="Select Specialist"
        placeholder="Choose a schedule"
        disallowEmptySelection={true}
        selectedKeys={selectedScheduleId ? [selectedScheduleId.toString()] : []}
        onSelectionChange={(value) => {
          // Extract the first (and only) value from the Set
          const selectedValue =
            value instanceof Set ? Array.from(value)[0] : value;
          handleSelectedScheduleById(selectedValue);
        }}
        className="w-full"
        radius="lg"
      >
        {schedules.map((schedule) => (
          <SelectItem key={schedule.scheduleId} value={schedule.scheduleId}>
            {`${schedule.user.firstName} ${schedule.user.lastName} (${schedule.user.email}) Schedule`}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default SelectSpecialist;
