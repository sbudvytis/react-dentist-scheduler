import { Spinner } from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";
import { IoPeopleOutline } from "react-icons/io5";

type Props = {
  isLoading: boolean;
};

const SettingsListboxItems = ({ isLoading }: Props) => {
  const location = useLocation();
  const iconClasses = "text-lg pointer-events-none flex-shrink-0";

  // Define active link styles
  const linkClasses = "flex items-center space-x-4 p-2";
  const activeLinkClasses = "bg-gray-100 text-gray-800 rounded-lg";

  const isSettingsActive = location.pathname.startsWith(
    "/dashboard/my-settings"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner color="default" />
      </div>
    );
  }

  return (
    <div className="flex flex-col text-sm text-gray-500">
      <Link
        to="/dashboard/my-settings"
        className={`${linkClasses} ${
          isSettingsActive || location.pathname === "/dashboard/my-settings"
            ? activeLinkClasses
            : "hover:text-gray-800"
        }`}
      >
        <IoPeopleOutline className={iconClasses} />
        <span>My settings</span>
      </Link>
    </div>
  );
};

export default SettingsListboxItems;
