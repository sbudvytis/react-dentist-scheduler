import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useCalendar from "@/hooks/useCalendar";
import useAuth from "@/hooks/useAuth";
import MobileNavItems from "./MobileNavItems";
import NavItems from "./NavItems";
import ListboxItems from "@/layouts/DashboardLayout/Sidebar/Listbox/ListboxItems";
import AdminListboxItems from "@/layouts/DashboardLayout/Sidebar/Listbox/AdminListboxItems";
import SettingsListboxItems from "@/layouts/DashboardLayout/Sidebar/Listbox/SettingsListboxItems";
import User from "@/layouts/MainLayout/Navbar/User/User";
import { Button } from "@nextui-org/react";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { schedules, schedulesLoading } = useCalendar();
  const [hasSchedule, setHasSchedule] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setLoading(schedulesLoading);
    if (schedules && schedules.length > 0) {
      setHasSchedule(true);
    } else {
      setHasSchedule(false);
    }
  }, [schedules, schedulesLoading]);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Determine if we are in the admin panel route
  const isAdminPanel = location.pathname.includes("/dashboard/admin-panel");
  const isUserSettings = location.pathname.includes("/dashboard/my-settings");

  return (
    <nav className="border-b border-gray-200 bg-gray-50 relative z-30">
      <div className="mx-auto flex justify-between h-16">
        {/* Logo and mobile menu toggle */}
        <div className="flex items-center lg:min-w-64 lg:max-w-64 md:min-w-56 px-4">
          {isLoggedIn && (
            <Button
              isIconOnly
              color="default"
              variant="bordered"
              radius="sm"
              onClick={toggleMenu}
              className="border-1 bg-white border-gray-200 shadow-md shadow-gray-100 focus:outline-none md:hidden"
              aria-label="Toggle Menu"
            >
              <IoMenuOutline size={28} />
            </Button>
          )}
          <div className="md:block hidden lg:min-w-64 lg:max-w-64">
            <Link to="/dashboard" className="flex items-center">
              <img src="/logo1.png" alt="Logo" className="h-9" />
              <p className="ml-3 md:text-sm font-bold">Dentist Scheduler</p>
            </Link>
          </div>
        </div>
        {/* Divider */}
        {isLoggedIn ? (
          <div className="hidden md:block border-l-1 border-gray-200 h-16"></div>
        ) : null}

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center flex-grow px-4">
          {isLoggedIn && <NavItems className="text-sm pr-2" />}
        </div>

        {/* User actions */}
        <div className="flex items-center px-4">
          {isLoggedIn ? (
            <User />
          ) : (
            <Button
              as={Link}
              to="/login"
              color="default"
              variant="bordered"
              radius="sm"
              className="border-1 bg-white border-gray-200 shadow-md shadow-gray-100"
            >
              Sign in / Sign up
            </Button>
          )}
        </div>
      </div>

      {/* Mobile sliding menu */}
      <div
        className={`fixed inset-0 z-30 transform transition-transform duration-500 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative w-72 h-full bg-white shadow-lg p-4 py-16 space-y-4 ">
          {/* Close button inside the sidebar */}
          <Button
            isIconOnly
            color="default"
            variant="bordered"
            radius="sm"
            onClick={closeMenu}
            className="absolute top-3 right-3 border-1 bg-white border-gray-200 shadow-md shadow-gray-100 focus:outline-none"
            aria-label="Close Menu"
          >
            <IoCloseOutline size={28} />
          </Button>

          {/* Sidebar content */}
          <MobileNavItems
            className="text-sm text-gray-600"
            closeMenu={closeMenu}
          />
          {isLoggedIn &&
            (isAdminPanel ? (
              <AdminListboxItems isLoading={isLoading} />
            ) : isUserSettings ? (
              <SettingsListboxItems isLoading={isLoading} />
            ) : (
              <ListboxItems hasSchedule={hasSchedule} isLoading={isLoading} />
            ))}
        </div>
      </div>

      {/* Dark overlay when menu is open */}
      <div
        className={`fixed inset-0 bg-black z-20 transition-opacity duration-500 ${
          isMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      ></div>
    </nav>
  );
};

export default NavigationBar;
