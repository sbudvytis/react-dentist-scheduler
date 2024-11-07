import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useCalendar from "@/hooks/useCalendar";
import useAuth from "@/hooks/useAuth";
import LogoAndTitle from "./LogoAndTitle";
import HamburgerMenu from "./HamburgerMenu";
import UserActions from "./UserActions";
import Sidebar from "./MobileSidebar";
import Overlay from "./Overlay";
import NavItems from "./NavItems";

interface Props {
  className?: string;
}

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

  // Disable scroll on menu open and enable it on menu close
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isAdminPanel = location.pathname.includes("/admin-panel");
  const isUserSettings = location.pathname.includes("/dashboard/my-settings");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`${className} bg-white relative z-20 h-16 items-center `}>
      <div className="mx-auto flex justify-between items-center h-full">
        <div
          className={`flex items-center h-full px-6 md:px-0 ${
            isLoggedIn
              ? "md:bg-gray-50 bg-white md:border-none border-b"
              : "bg-gray-50"
          }`}
        >
          {isLoggedIn && <HamburgerMenu toggleMenu={toggleMenu} />}
          <LogoAndTitle isLoggedIn={isLoggedIn} />
        </div>

        <div className="flex items-center flex-grow px-6 gap-8 h-full bg-white justify-end md:justify-between border-b">
          <div className="hidden md:flex gap-4">
            <NavItems />
          </div>
          <UserActions isLoggedIn={isLoggedIn} />
        </div>
      </div>

      <Sidebar
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
        isAdminPanel={isAdminPanel}
        isUserSettings={isUserSettings}
        hasSchedule={hasSchedule}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
      />
      <Overlay isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
    </nav>
  );
};

export default NavigationBar;
