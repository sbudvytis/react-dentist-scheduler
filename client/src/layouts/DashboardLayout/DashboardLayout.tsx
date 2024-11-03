import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import useCalendar from "@/hooks/useCalendar";
import AdminListboxItems from "./Sidebar/Listbox/AdminListboxItems";
import ListboxItems from "./Sidebar/Listbox/ListboxItems";
import SettingsListboxItems from "./Sidebar/Listbox/SettingsListboxItems";
import useAuth from "@/hooks/useAuth";
import NavigationBar from "../MainLayout/Navbar/Navigation/Navigation";

interface LayoutProps {
  layoutType?: "admin" | "default" | "settings";
  className?: string;
}

export default function DashboardLayout({
  layoutType = "default",
  className = "",
}: LayoutProps) {
  const { schedules, schedulesLoading } = useCalendar();
  const [hasSchedule, setHasSchedule] = useState(false);
  const { canApproveUsers } = useAuth();

  const emptyFunction = () => {};

  useEffect(() => {
    setHasSchedule(schedules && schedules.length > 0);
  }, [schedules, schedulesLoading]);

  const renderSidebarItems = () => {
    switch (layoutType) {
      case "admin":
        if (canApproveUsers) {
          return (
            <AdminListboxItems
              isLoading={schedulesLoading}
              closeMenu={emptyFunction}
            />
          );
        }
        break;
      case "settings":
        return (
          <SettingsListboxItems
            isLoading={schedulesLoading}
            closeMenu={emptyFunction}
          />
        );
      default:
        return (
          <ListboxItems
            hasSchedule={hasSchedule}
            isLoading={schedulesLoading}
            closeMenu={emptyFunction}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <NavigationBar className="flex-shrink-0" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="lg:min-w-72 lg:max-w-72 md:min-w-60 flex-shrink-0 overflow-y-auto bg-white py-1">
          {renderSidebarItems()}
        </Sidebar>
        <main
          className={`hide-main-scrollbar flex-1 overflow-y-auto bg-slate-100 px-6 pb-6 ${className}`}
        >
          <div className="pt-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
