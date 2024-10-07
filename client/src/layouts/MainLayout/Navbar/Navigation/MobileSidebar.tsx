import { useEffect, useRef } from "react";
import { Button } from "@nextui-org/react";
import { IoCloseOutline } from "react-icons/io5";
import MobileNavItems from "./MobileNavItems";
import ListboxItems from "@/layouts/DashboardLayout/Sidebar/Listbox/ListboxItems";
import AdminListboxItems from "@/layouts/DashboardLayout/Sidebar/Listbox/AdminListboxItems";
import SettingsListboxItems from "@/layouts/DashboardLayout/Sidebar/Listbox/SettingsListboxItems";

type Props = {
  isMenuOpen: boolean;
  closeMenu: () => void;
  isAdminPanel: boolean;
  isUserSettings: boolean;
  hasSchedule: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
};

const Sidebar = ({
  isMenuOpen,
  closeMenu,
  isAdminPanel,
  isUserSettings,
  hasSchedule,
  isLoading,
  isLoggedIn,
}: Props) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <div
      className={`fixed inset-0 z-30 transform transition-transform duration-500 ease-in-out lg:hidden ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div
        className="relative w-80 h-screen bg-white shadow-lg p-4 space-y-4 py-16"
        ref={sidebarRef}
      >
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
            <SettingsListboxItems isLoading={isLoading} closeMenu={closeMenu} />
          ) : (
            <ListboxItems
              hasSchedule={hasSchedule}
              isLoading={isLoading}
              closeMenu={closeMenu}
            />
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
