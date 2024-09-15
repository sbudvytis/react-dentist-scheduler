import React from "react";
import { Outlet } from "react-router-dom";
import Breadcrumbs from "../DashboardLayout/Breadcrumbs";
import Sidebar from "../DashboardLayout/Sidebar/Sidebar";
import AdminListboxItems from "../DashboardLayout/Sidebar/Listbox/AdminListboxItems";
import AdminGuard from "@/components/Dashboard/AdminPanel/AdminGuard";
import useAuth from "@/hooks/useAuth";

const AdminPanelLayout: React.FC = () => {
  const { canApproveUsers } = useAuth();

  return (
    <main className="flex flex-col inset-0 min-h-full w-full">
      <div className="relative flex flex-1 justify-center">
        <div className="flex-1 bg-gray-50"></div>
        <div className="relative flex w-full max-w-screen-2xl gap-2">
          {/* Conditionally render the sidebar based on the user's permissions */}
          {canApproveUsers && (
            <Sidebar
              className="min-w-72 flex-none bg-gray-50 px-4 py-0"
              hasSchedule={false}
              isLoading={false}
              children={<AdminListboxItems isLoading={false} />}
            />
          )}
          {/* Adjust flex behavior if the sidebar is hidden */}
          <div
            className={`flex-1 bg-white p-5 border-l-1 border-gray-200 ${
              canApproveUsers ? "" : "ml-0"
            }`}
          >
            <AdminGuard>
              <Breadcrumbs className="pb-4" />
              <Outlet />
            </AdminGuard>
          </div>
        </div>
        <div className="flex-1 bg-white"></div>
      </div>
    </main>
  );
};

export default AdminPanelLayout;
