import AllUsers from "./AllUsers";
import ApproveUsers from "./ApproveUsers";

import { IoPersonAddOutline, IoPeopleOutline } from "react-icons/io5";
import useAuth from "@/hooks/useAuth";
import AdminGuard from "../AdminGuard";

const Users = () => {
  const { canApproveUsers } = useAuth();
  return (
    <>
      {canApproveUsers ? (
        <>
          <div>
            <h1 className="text-xl text-left flex items-center gap-2 text-gray-800 font-semibold">
              Users
            </h1>
            <h2 className="text-sm text-gray-400">
              Explore your users and their status
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full py-4">
            {/* Users waiting for approval */}
            <div className="lg:w-1/2 lg:py-0">
              <h1 className="pb-4 text-sm text-left flex items-center gap-2 text-gray-600 font-medium">
                <IoPersonAddOutline /> Users waiting for approval
              </h1>
              <ApproveUsers />
            </div>
            {/* Users currently in the system */}
            <div className="lg:w-1/2">
              <h1 className="pb-4 text-sm text-left flex items-center gap-2 text-gray-600 font-medium">
                <IoPeopleOutline /> Users currently in the system
              </h1>
              <AllUsers />
            </div>
          </div>
        </>
      ) : (
        <AdminGuard />
      )}
    </>
  );
};

export default Users;
