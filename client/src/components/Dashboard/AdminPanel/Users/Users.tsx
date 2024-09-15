import AllUsers from "./AllUsers";
import ApproveUsers from "./ApproveUsers";

import { IoPersonAddOutline, IoPeopleOutline } from "react-icons/io5";

const Users = () => {
  return (
    <div>
      <h1 className="pb-4 text-sm text-left flex items-center gap-2 text-gray-600">
        <IoPersonAddOutline /> Users waiting for approval
      </h1>
      <ApproveUsers />
      <div className="py-3">
        <h1 className="py-4 text-sm text-left flex items-center gap-2 text-gray-600">
          <IoPeopleOutline /> Users currently in the system
        </h1>
        <AllUsers />
      </div>
    </div>
  );
};

export default Users;
