import { Avatar } from "@nextui-org/react";
import useAuth from "@/hooks/useAuth";
import { getUserFromToken } from "@/utils/auth";
import Badge from "./Badge";
import { useSelectedSchedule } from "@/hooks/useSelectedSchedule";
import useTodayAppointments from "@/hooks/useTodayAppointments";

const LoggedInUser = () => {
  const { isLoggedIn, authToken } = useAuth();

  const { selectedScheduleId } = useSelectedSchedule();
  const currentUser =
    isLoggedIn && authToken ? getUserFromToken(authToken) : null;

  const { todaysAppointments } = useTodayAppointments(selectedScheduleId);

  return (
    <div className="px-2">
      {isLoggedIn && currentUser && (
        <div className="flex items-center gap-4 mt-4">
          <div className="relative">
            {todaysAppointments.length > 0 && (
              <Badge todaysAppointments={todaysAppointments} />
            )}
            <Avatar
              name={`${currentUser.firstName} ${currentUser.lastName}`}
              isBordered
              radius="sm"
              className="z-10"
            />
          </div>

          <div className="flex flex-col">
            <div className="text-sm">{`${currentUser.firstName} ${currentUser.lastName}`}</div>
            <div className="text-xs text-gray-500">{`${currentUser.role} (${currentUser.email})`}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoggedInUser;
