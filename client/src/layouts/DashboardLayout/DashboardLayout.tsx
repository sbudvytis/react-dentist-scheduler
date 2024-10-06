import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import useCalendar from "@/hooks/useCalendar";
import Breadcrumbs from "./Breadcrumbs";
import AdminListboxItems from "./Sidebar/Listbox/AdminListboxItems";
import ListboxItems from "./Sidebar/Listbox/ListboxItems";
import SettingsListboxItems from "./Sidebar/Listbox/SettingsListboxItems";
import useAuth from "@/hooks/useAuth";
import NavigationBar from "../MainLayout/Navbar/Navigation/Navigation";

type LayoutProps = {
  layoutType?: "admin" | "default" | "settings";
  className?: string;
};

const DashboardLayout: React.FC<LayoutProps> = ({
  layoutType = "default",
  className = "",
}) => {
  const { schedules, schedulesLoading } = useCalendar();
  const [hasSchedule, setHasSchedule] = useState(false);
  const { canApproveUsers } = useAuth();

  useEffect(() => {
    setHasSchedule(schedules && schedules.length > 0);
  }, [schedules, schedulesLoading]);

  const renderSidebarItems = () => {
    switch (layoutType) {
      case "admin":
        if (canApproveUsers) {
          return <AdminListboxItems isLoading={schedulesLoading} />;
        }
        break;
      case "settings":
        return <SettingsListboxItems isLoading={schedulesLoading} />;
      default:
        return (
          <ListboxItems
            hasSchedule={hasSchedule}
            isLoading={schedulesLoading}
          />
        );
    }
  };

  return (
    <main className="flex flex-col inset-0 min-h-[100dvh]">
      <NavigationBar />
      <div className="relative flex flex-1 w-full">
        <Sidebar className="lg:min-w-64 lg:max-w-64 md:min-w-56 flex-none bg-gray-50">
          {renderSidebarItems()}
        </Sidebar>
        <div
          className={`flex-1 bg-white w-full p-4 border-l border-gray-200 ${className}`}
        >
          <Breadcrumbs className="pb-4" />
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
