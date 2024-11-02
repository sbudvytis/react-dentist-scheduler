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
        <div className="bg-[#ffe7ef] text-[#f31261] p-4 rounded-2xl text-sm">
          <p>
            You do not have permission to view this page.{" "}
            <Link to="/" className="font-semibold hover:text-[#ff1567]">
              Go back to Dashboard
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default AdminGuard;
