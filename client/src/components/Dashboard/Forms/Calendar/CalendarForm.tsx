import { useState } from "react";
import {
  Select,
  SelectItem,
  TimeInput,
  Button,
  Switch,
} from "@nextui-org/react";
import { IoTimeOutline } from "react-icons/io5";
import { Time } from "@internationalized/date";
import { CalendarConfig } from "../../types";

interface CalendarFormProps {
  initialData: CalendarConfig;
  onSubmit: (calendarConfig: CalendarConfig) => void;
  onClose: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
}

const CalendarForm: React.FC<CalendarFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText,
}) => {
  const [view, setView] = useState<string>(initialData?.view || "timeGridWeek");
  const [weekends, setWeekends] = useState<boolean>(
    initialData?.weekends !== undefined ? initialData.weekends : true
  );
  const [slotMinTime, setSlotMinTime] = useState<Time>(
    initialData?.slotMinTime
      ? new Time(...initialData.slotMinTime.split(":").map(Number))
      : new Time(8, 0)
  );
  const [slotMaxTime, setSlotMaxTime] = useState<Time>(
    initialData?.slotMaxTime
      ? new Time(...initialData.slotMaxTime.split(":").map(Number))
      : new Time(17, 0)
  );

  const viewOptions = [
    { value: "timeGridWeek", label: "Time Grid Week" },
    { value: "timeGridDay", label: "Time Grid Day" },
    { value: "dayGridMonth", label: "Month" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newCalendarConfig: CalendarConfig = {
      scheduleId: initialData.scheduleId,
      userId: initialData.userId,
      view,
      weekends,
      slotMinTime: `${slotMinTime.toString()}:00`,
      slotMaxTime: `${slotMaxTime.toString()}:00`,
    };

    await onSubmit(newCalendarConfig);
  };

  const isMobile = window.innerWidth <= 1024;

  return (
    <div className="py-4">
      <form onSubmit={handleSubmit} className="grid space-y-4">
        {!isMobile && (
          <div>
            <Select
              isRequired
              required
              radius="lg"
              size="sm"
              label="Select schedule view"
              defaultSelectedKeys={[view]}
              onChange={(e) => setView(e.target.value)}
              data-testid="schedule-view-select"
            >
              {viewOptions.map((viewOption) => (
                <SelectItem key={viewOption.value}>
                  {viewOption.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}
        <div className="flex gap-4">
          <TimeInput
            isRequired
            radius="lg"
            size="sm"
            label="Start time"
            startContent={<IoTimeOutline />}
            value={slotMinTime}
            onChange={setSlotMinTime}
            description="Your starting hours"
            hourCycle={24}
          />
          <TimeInput
            isRequired
            radius="lg"
            size="sm"
            label="End time"
            startContent={<IoTimeOutline />}
            value={slotMaxTime}
            onChange={setSlotMaxTime}
            description="Your end hours"
            hourCycle={24}
          />
        </div>
        <div className="justify-center flex">
          <Switch
            isSelected={weekends}
            color="default"
            size="sm"
            onChange={(e) => setWeekends(e.target.checked)}
          >
            Include weekends
          </Switch>
        </div>
        <div className="flex justify-center lg:justify-end">
          <Button
            type="submit"
            radius="lg"
            variant="solid"
            isLoading={isSubmitting}
            className="border-none bg-black hover:bg-indigo-600 text-white h-9"
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CalendarForm;
