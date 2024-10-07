import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const AdminGuard = () => {
  const { canApproveUsers } = useAuth();

  if (!canApproveUsers) {
    return (
      <div className="flex flex-col justify-center items-center text-center p-4">
        <img
          src="/not-allowed.svg"
          alt="Not allowed"
          className="size-96 mb-4"
        />
        <p className="text-gray-800">
          You do not have permission to view this page.{" "}
          <Link to="/" className="font-medium text-black hover:text-indigo-600">
            Go back to Dashboard
          </Link>
        </p>
      </div>
    );
  }

  return null;
};

export default AdminGuard;
