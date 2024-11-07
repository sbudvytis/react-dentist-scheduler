import { Spinner } from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";
import {
  IoSettingsOutline,
  IoPeopleOutline,
  IoMedicalOutline,
} from "react-icons/io5";

interface Props {
  isLoading: boolean;
  closeMenu: () => void;
}

const AdminListboxItems = ({ isLoading, closeMenu }: Props) => {
  const location = useLocation();
  const iconClasses = "text-lg pointer-events-none flex-shrink-0";

  // Define active link styles
  const linkClasses =
    "flex items-center space-x-4 p-2 hover:bg-indigo-50 hover:text-indigo-500 rounded-xl";
  const activeLinkClasses = "bg-indigo-50 text-indigo-500 rounded-xl";

  const isUsersActive = location.pathname.startsWith("/admin-panel/users");
  const isSettingsActive = location.pathname.startsWith(
    "/admin-panel/settings"
  );
  const isPatientsActive = location.pathname.startsWith(
    "/admin-panel/patients"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner color="default" />
      </div>
    );
  }

  return (
    <div className="flex flex-col text-sm text-gray-500 font-medium space-y-1">
      <Link
        to="/admin-panel/users"
        onClick={closeMenu}
        className={`${linkClasses} ${
          isUsersActive || location.pathname === "/admin-panel"
            ? activeLinkClasses
            : "hover:text-gray-800"
        }`}
      >
        <IoPeopleOutline className={iconClasses} />
        <span>Users</span>
      </Link>
      <Link
        to="/admin-panel/patients"
        onClick={closeMenu}
        className={`${linkClasses} ${
          isPatientsActive ? activeLinkClasses : "hover:text-gray-800"
        }`}
      >
        <IoMedicalOutline className={iconClasses} />
        <span>Patients</span>
      </Link>
      <Link
        to="/admin-panel/settings"
        onClick={closeMenu}
        className={`${linkClasses} ${
          isSettingsActive ? activeLinkClasses : "hover:text-gray-800"
        }`}
      >
        <IoSettingsOutline className={iconClasses} />
        <span>Settings</span>
      </Link>
    </div>
  );
};

export default AdminListboxItems;
