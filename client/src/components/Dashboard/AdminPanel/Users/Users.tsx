import AllUsers from "./AllUsers";
import ApproveUsers from "./ApproveUsers";

import { IoPersonAddOutline, IoPeopleOutline } from "react-icons/io5";
import UserWidgets from "./UserWidgets";

const Users = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Users currently in the system */}
        <div className="lg:w-1/3">
          <UserWidgets />
        </div>
        <div className="lg:w-1/3">
          <UserWidgets />
        </div>
        <div className="lg:w-1/3">
          <UserWidgets />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full py-4">
        {/* Users currently in the system */}
        <div className="lg:w-1/2">
          <h1 className="pb-4 text-sm text-left flex items-center gap-2 text-gray-600 font-bold">
            <IoPeopleOutline /> Users currently in the system
          </h1>
          <AllUsers />
        </div>
        {/* Users waiting for approval */}
        <div className="lg:w-1/2 lg:py-0 py-6">
          <h1 className="pb-4 text-sm text-left flex items-center gap-2 text-gray-600 font-bold">
            <IoPersonAddOutline /> Users waiting for approval
          </h1>
          <ApproveUsers />
        </div>
      </div>
    </>
  );
};

export default Users;
