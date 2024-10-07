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

type Props = {
  className?: string;
};

const NavigationBar = ({ className }: Props) => {
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

  const isAdminPanel = location.pathname.includes("/dashboard/admin-panel");
  const isUserSettings = location.pathname.includes("/dashboard/my-settings");

  return (
    <nav
      className={`${className} border-b border-gray-200 bg-gray-50 relative z-20 h-16`}
    >
      <div className="mx-auto flex justify-between items-center h-full px-4">
        <div className="flex items-center lg:min-w-68 lg:max-w-68 md:min-w-52">
          {isLoggedIn && (
            <Button
              isIconOnly
              color="default"
              variant="bordered"
              radius="sm"
              onClick={toggleMenu}
              className="border-1 bg-white border-gray-200 focus:outline-none md:hidden"
              aria-label="Toggle Menu"
            >
              <IoMenuOutline size={28} />
            </Button>
          )}
          <div className="hidden md:flex items-center lg:min-w-68 lg:max-w-68">
            <Link to="/dashboard" className="flex items-center">
              <img src="/logo1.png" alt="Logo" className="h-9" />
              <p className="ml-3 text-md font-semibold">Dentist Scheduler</p>
            </Link>
          </div>
        </div>

        {/* Conditionally set the logo and title position for mobile view */}
        <div
          className={`md:hidden items-center absolute ${
            isLoggedIn ? "left-1/2 transform -translate-x-1/2" : "left-4"
          }`}
        >
          <Link to="/dashboard" className="flex items-center">
            <img src="/logo1.png" alt="Logo" className="h-9" />
            <p className="ml-3 text-sm font-bold">Dentist Scheduler</p>
          </Link>
        </div>

        {isLoggedIn ? (
          <div className="hidden md:block border-l-1 border-gray-200 h-full"></div>
        ) : null}

        <div className="hidden md:flex items-center flex-grow px-4">
          {isLoggedIn && <NavItems className="text-sm pr-2" />}
        </div>

        <div className="flex items-center">
          {isLoggedIn ? (
            <User />
          ) : (
            <Button
              as={Link}
              to="/login"
              color="default"
              variant="bordered"
              radius="sm"
              className="border-1 bg-white border-gray-200"
            >
              Sign in / Sign up
            </Button>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-30 min-h-[calc(100dvh-80px)] transform transition-transform duration-500 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative w-72 bg-white shadow-lg p-4 space-y-4 py-16">
          <Button
            isIconOnly
            color="default"
            variant="bordered"
            radius="sm"
            onClick={closeMenu}
            className="absolute top-3 right-3 border-1 bg-white border-gray-200 focus:outline-none"
            aria-label="Close Menu"
          >
            <IoCloseOutline size={28} />
          </Button>
          <MobileNavItems
            className="text-sm text-gray-600"
            closeMenu={closeMenu}
          />
          {isLoggedIn &&
            (isAdminPanel ? (
              <AdminListboxItems isLoading={isLoading} closeMenu={closeMenu} />
            ) : isUserSettings ? (
              <SettingsListboxItems
                isLoading={isLoading}
                closeMenu={closeMenu}
              />
            ) : (
              <ListboxItems
                hasSchedule={hasSchedule}
                isLoading={isLoading}
                closeMenu={closeMenu}
              />
            ))}
        </div>
      </div>

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
