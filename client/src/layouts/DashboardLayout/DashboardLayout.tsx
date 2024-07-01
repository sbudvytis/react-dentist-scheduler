import React, { useEffect, useState } from "react";
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
      <div className="relative flex flex-1 justify-center p-3">
        <div className="relative flex w-full max-w-screen-2xl gap-4">
          <Sidebar
            className="w-72 flex-none rounded-xl bg-white shadow-lg shadow-gray-100  border-1 border-gray-100"
            hasSchedule={hasSchedule}
            isLoading={isLoading}
          />
          <div className="flex-1 bg-white p-5 rounded-xl shadow-lg shadow-gray-100 border-1 border-gray-100">
            <Breadcrumbs className="pb-4" />
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
