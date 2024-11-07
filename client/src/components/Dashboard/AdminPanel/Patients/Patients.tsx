import useAuth from "@/hooks/useAuth";
import AllPatients from "./AllPatients";
import AdminGuard from "../AdminGuard";

const Patients = () => {
  const { canApproveUsers } = useAuth();
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {canApproveUsers ? (
        <div className="lg:w-full">
          <div className="pb-6">
            <h1 className="text-2xl text-left flex items-center gap-2 text-gray-800 font-semibold">
              Patients
            </h1>
            <h2 className="text-sm text-gray-500">
              Find patient list and their appointments
            </h2>
          </div>
          <AllPatients />
        </div>
      ) : (
        <AdminGuard />
      )}
    </div>
  );
};

export default Patients;
