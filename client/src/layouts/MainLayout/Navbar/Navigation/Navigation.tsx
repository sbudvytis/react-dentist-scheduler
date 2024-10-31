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
    <nav
      className={`${className} border-b border-gray-200 bg-[#fbfbfb] relative z-20 h-16`}
    >
      <div className="mx-auto flex justify-between items-center h-full px-7">
        <div className="flex items-center lg:min-w-68 lg:max-w-68 md:min-w-52">
          {isLoggedIn && <HamburgerMenu toggleMenu={toggleMenu} />}
          <LogoAndTitle isLoggedIn={isLoggedIn} />
        </div>

        {isLoggedIn && (
          <div className="hidden md:block border-l-1 border-gray-200 h-full"></div>
        )}

        <div className="hidden md:flex items-center flex-grow px-4 gap-2">
          <NavItems />
        </div>

        <UserActions isLoggedIn={isLoggedIn} />
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
