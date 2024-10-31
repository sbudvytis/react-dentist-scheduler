import AllUsers from "./AllUsers";

import { IoPeopleOutline } from "react-icons/io5";
import useAuth from "@/hooks/useAuth";
import AdminGuard from "../AdminGuard";
import AddUser from "./AddUser";

const Users = () => {
  const { canApproveUsers, clinicId } = useAuth();
  return (
    <>
      {canApproveUsers ? (
        <>
          <div className="pb-6">
            <h1 className="text-xl text-left flex items-center gap-2 text-gray-800 font-semibold">
              Users
            </h1>
            <h2 className="text-sm text-gray-400">
              Explore your users and their status
            </h2>
          </div>
          <div className="flex flex-col gap-4 w-full">
            {/* Add new users to the system */}
            <div className="lg:w-1/2 pb-4">
              <AddUser currentClinicId={clinicId} />
            </div>
            {/* Users currently in the system */}
            <div className="lg:w-full lg:py-0">
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
