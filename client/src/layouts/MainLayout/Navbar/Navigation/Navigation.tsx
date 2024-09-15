import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  Divider,
  Button,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import NavItems from "./NavItems";
import ListboxItems from "@/layouts/DashboardLayout/Sidebar/Listbox/ListboxItems";
import AdminListboxItems from "@/layouts/DashboardLayout/Sidebar/Listbox/AdminListboxItems";
import useCalendar from "@/hooks/useCalendar";
import MobileNavItems from "./MobileNavItems";
import useAuth from "@/hooks/useAuth";
import User from "@/layouts/MainLayout/Navbar/User/User";
import { useLocation } from "react-router-dom";

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Determine if we are in the admin panel route
  const isAdminPanel = location.pathname.includes("/dashboard/admin-panel");

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      maxWidth="2xl"
      className="border-b border-gray-200 bg-gray-50"
    >
      <NavbarContent className="h-full">
        {isLoggedIn && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        )}
        {/* Adjusting width to match the Sidebar */}
        <div className="flex items-center lg:min-w-64">
          {/* Hiding logo on mobile */}
          <Link
            to="/dashboard"
            color="foreground"
            className="active:scale-95 transition-all hidden sm:flex items-center"
          >
            <img src="/logo1.png" alt="Logo" className="h-9" />{" "}
            <p className="font-bold text-inherit pl-3">Dentist scheduler</p>
          </Link>
        </div>
        {isLoggedIn ? (
          <Divider
            orientation="vertical"
            className="hidden sm:flex bg-gray-200"
          />
        ) : null}
        <NavbarContent
          className={`hidden sm:flex justify-start px-1 ${
            !isLoggedIn ? "flex-grow" : ""
          }`}
        >
          {isLoggedIn ? <NavItems className="text-sm" /> : null}
        </NavbarContent>

        <div
          className={`ml-auto flex items-center ${
            isLoggedIn ? "sm:ml-0" : "flex-grow justify-end"
          }`}
        >
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
      </NavbarContent>

      {/* NavbarMenu section for mobile view */}
      <NavbarMenu className="bg-gray-50">
        <MobileNavItems
          className="text-sm text-gray-600 py-4"
          closeMenu={closeMenu}
        />
        {isLoggedIn &&
          (isAdminPanel ? (
            <AdminListboxItems isLoading={isLoading} />
          ) : (
            <ListboxItems hasSchedule={hasSchedule} isLoading={isLoading} />
          ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavigationBar;
