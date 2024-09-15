import { Spinner } from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";
import {
  IoSettingsOutline,
  IoPeopleOutline,
  IoMedicalOutline,
} from "react-icons/io5";

type Props = {
  isLoading: boolean;
};

const AdminListboxItems = ({ isLoading }: Props) => {
  const location = useLocation();
  const iconClasses = "text-lg pointer-events-none flex-shrink-0";

  // Define active link styles
  const linkClasses = "flex items-center space-x-4 p-2";
  const activeLinkClasses = "bg-gray-100 text-gray-800 p-2 rounded-lg";

  const isUsersActive = location.pathname.startsWith(
    "/dashboard/admin-panel/users"
  );
  const isSettingsActive = location.pathname.startsWith(
    "/dashboard/admin-panel/settings"
  );
  const isPatientsActive = location.pathname.startsWith(
    "/dashboard/admin-panel/patients"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner color="default" />
      </div>
    );
  }

  return (
    <div className="flex flex-col text-sm text-gray-500 px-2">
      <Link
        to="/dashboard/admin-panel/users"
        className={`${linkClasses} ${
          isUsersActive || location.pathname === "/dashboard/admin-panel"
            ? activeLinkClasses
            : "hover:text-gray-800"
        }`}
      >
        <IoPeopleOutline className={iconClasses} />
        <span>Users</span>
      </Link>
      <Link
        to="/dashboard/admin-panel/patients"
        className={`${linkClasses} ${
          isPatientsActive ? activeLinkClasses : "hover:text-gray-800"
        }`}
      >
        <IoMedicalOutline className={iconClasses} />
        <span>Patients</span>
      </Link>
      <Link
        to="/dashboard/admin-panel/settings"
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
