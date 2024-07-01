import { createBrowserRouter } from "react-router-dom";
import AuthGuardProps from "./guards";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import Signup from "@/components/User/Signup";
import Login from "@/components/User/Login";
import AdminPanel from "@/components/Dashboard/AdminPanel/AdminPanel";
import Dashboard from "@/components/Dashboard/Dashboard";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import AppProviders from "@/components/providers/AppProviders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppProviders>
        <MainLayout>
          <Login />
        </MainLayout>
      </AppProviders>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AppProviders>
        <AuthGuardProps>
          <MainLayout>
            <DashboardLayout />
          </MainLayout>
        </AuthGuardProps>
      </AppProviders>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "admin-panel",
        element: <AdminPanel />,
      },
    ],
  },
  {
    path: "/signup",
    element: (
      <AppProviders>
        <MainLayout>
          <Signup />
        </MainLayout>
      </AppProviders>
    ),
  },
  {
    path: "/login",
    element: (
      <AppProviders>
        <MainLayout>
          <Login />
        </MainLayout>
      </AppProviders>
    ),
  },
]);
