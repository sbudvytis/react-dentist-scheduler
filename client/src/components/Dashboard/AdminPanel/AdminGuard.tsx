import useAuth from "@/hooks/useAuth";
import { Chip } from "@nextui-org/react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const AdminGuard = () => {
  const { canApproveUsers } = useAuth();

  if (!canApproveUsers) {
    return (
      <div className="flex flex-col justify-center items-center text-center rounded-2xl p-6 bg-white">
        <img
          src="/not-allowed.svg"
          alt="Not allowed"
          className="size-96 mb-4"
        />
        <div className="text-center">
          <Chip
            className="text-sm text-center p-4"
            startContent={<IoCloseCircleOutline size={18} />}
            radius="md"
            variant="flat"
            color="danger"
            size="lg"
          >
            <p>
              You do not have permission to view this page.{" "}
              <Link to="/" className="font-semibold hover:underline">
                Go back to Dashboard
              </Link>
            </p>
          </Chip>
        </div>
      </div>
    );
  }

  return null;
};

export default AdminGuard;
