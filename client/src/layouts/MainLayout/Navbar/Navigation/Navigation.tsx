import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  Link,
} from "@nextui-org/react";
import NavItems from "./NavItems";
import LoggedInUser from "@/layouts/DashboardLayout/Sidebar/User/LoggedInUser";
import ListboxItems from "@/layouts/DashboardLayout/Sidebar/Listbox/ListboxItems";
import useCalendar from "@/hooks/useCalendar";
import MobileNavItems from "./MobileNavItems";
import useAuth from "@/hooks/useAuth";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { schedules, schedulesLoading } = useCalendar();
  const [hasSchedule, setHasSchedule] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setLoading(schedulesLoading);
    if (schedules && schedules.length > 0) {
      setHasSchedule(true);
    } else {
      setHasSchedule(false);
    }
  }, [schedules, schedulesLoading]);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
      className="px-3 border-b-1 border-gray-200 bg-white"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link
            href="/dashboard"
            color="foreground"
            className="active:scale-95 transition-all"
          >
            <img src="logo1.png" alt="Logo" className="h-9" />{" "}
            <p className="font-bold text-inherit px-3">Dentist scheduler</p>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex" justify="end">
          <NavItems className="text-sm" />
        </NavbarContent>
      </NavbarContent>

      {/* NavbarMenu section for mobile view */}
      <NavbarMenu>
        <div className="pb-4">
          <LoggedInUser />
        </div>
        {isLoggedIn && (
          <ListboxItems hasSchedule={hasSchedule} isLoading={isLoading} />
        )}
        <MobileNavItems className="text-sm text-gray-600 py-4" />
      </NavbarMenu>
    </Navbar>
  );
};

export default NavigationBar;
