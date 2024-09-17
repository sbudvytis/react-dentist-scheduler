import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import useCalendar from "@/hooks/useCalendar";
import Breadcrumbs from "./Breadcrumbs";

const DashboardLayout: React.FC = () => {
  const { schedules, schedulesLoading } = useCalendar();
  const [hasSchedule, setHasSchedule] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(schedulesLoading);
    if (schedules && schedules.length > 0) {
      setHasSchedule(true);
    } else {
      setHasSchedule(false);
    }
  }, [schedules, schedulesLoading]);

  return (
    <main className="flex flex-col inset-0 min-h-full w-full">
      {/* Main container */}
      <div className="relative flex flex-1 w-full">
        {/* Left side (50%) */}
        <div className="flex-1 bg-gray-50"></div>
        {/* Middle container constrained by max-width */}
        <div className="relative flex w-full max-w-screen-2xl pl-2">
          <Sidebar
            className="min-w-72 flex-none bg-gray-50 px-4 py-2"
            hasSchedule={hasSchedule}
            isLoading={isLoading}
          />
          <div className="flex-1 bg-white p-5 border-l-1 border-gray-200">
            <Breadcrumbs className="pb-4" />
            <Outlet />
          </div>
        </div>
        {/* Right side (50%) */}
        <div className="flex-1 bg-white"></div>
      </div>
    </main>
  );
};

export default DashboardLayout;
