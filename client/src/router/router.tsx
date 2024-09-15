import { createBrowserRouter } from "react-router-dom";
import AuthGuardProps from "./guards";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import Signup from "@/components/User/Signup";
import Login from "@/components/User/Login";
import Dashboard from "@/components/Dashboard/Dashboard";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import AdminPanelLayout from "@/layouts/AdminPanelLayout/AdminPanelLayout";
import AppProviders from "@/components/providers/AppProviders";
import Users from "@/components/Dashboard/AdminPanel/Users/Users";
import Settings from "@/components/Dashboard/AdminPanel/Settings/Settings";
import Patients from "@/components/Dashboard/AdminPanel/Patients/Patients";
import SettingsLayout from "@/layouts/SettingsLayout/SettingsLayout";
import MySettings from "@/components/Dashboard/UserSettings/MySettings";

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
    ],
  },
  {
    path: "/dashboard/my-settings",
    element: (
      <AppProviders>
        <AuthGuardProps>
          <MainLayout>
            <SettingsLayout />
          </MainLayout>
        </AuthGuardProps>
      </AppProviders>
    ),
    children: [
      {
        path: "",
        element: <MySettings />,
      },
    ],
  },
  {
    path: "/dashboard/admin-panel",
    element: (
      <AppProviders>
        <AuthGuardProps>
          <MainLayout>
            <AdminPanelLayout />
          </MainLayout>
        </AuthGuardProps>
      </AppProviders>
    ),
    children: [
      {
        path: "",
        element: <Users />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "patients",
        element: <Patients />,
      },
      {
        path: "settings",
        element: <Settings />,
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
