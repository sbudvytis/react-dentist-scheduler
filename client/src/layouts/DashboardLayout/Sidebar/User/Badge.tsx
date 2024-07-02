import { Tooltip } from "@nextui-org/react";
import { Appointment } from "@/components/Dashboard/types";

interface BadgeProps {
  todaysAppointments: Appointment[];
}

const Badge = ({ todaysAppointments }: BadgeProps) => {
  return (
    <Tooltip
      placement="right"
      color="danger"
      radius="sm"
      content={`${todaysAppointments.length} appointment${
        todaysAppointments.length !== 1 ? "s" : ""
      } for today`}
    >
      <div className="bg-custom-pink text-white text-xs border-2 border-white absolute top-0 right-0 -mt-3 -mr-3 rounded-full h-6 w-6 p-2 flex items-center justify-center z-20">
        {todaysAppointments.length}
      </div>
    </Tooltip>
  );
};

export default Badge;
