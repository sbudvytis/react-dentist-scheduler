import React from "react";
import { Outlet } from "react-router-dom";
import Breadcrumbs from "../DashboardLayout/Breadcrumbs";
import Sidebar from "../DashboardLayout/Sidebar/Sidebar";
import SettingsListboxItems from "../DashboardLayout/Sidebar/Listbox/SettingsListboxItems";

const SettingsLayout: React.FC = () => {
  return (
    <main className="flex flex-col inset-0 min-h-full w-full">
      <div className="relative flex flex-1 justify-center">
        <div className="flex-1 bg-gray-50"></div>
        <div className="relative flex w-full max-w-screen-2xl gap-2">
          <Sidebar
            className="min-w-72 flex-none bg-gray-50 py-0"
            hasSchedule={false}
            isLoading={false}
            children={<SettingsListboxItems isLoading={false} />}
          />
          <div className="flex-1 bg-white p-5 border-l-1 border-gray-200">
            <Breadcrumbs className="pb-4" />
            <Outlet />
          </div>
        </div>
        <div className="flex-1 bg-white"></div>
      </div>
    </main>
  );
};

export default SettingsLayout;
