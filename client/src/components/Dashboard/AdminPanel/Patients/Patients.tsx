import AllPatients from "./AllPatients";
import { IoMedicalOutline } from "react-icons/io5";

const Patients = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <div className="lg:w-full">
        <h1 className="pb-4 text-sm text-left flex items-center gap-2 text-gray-600 font-bold">
          <IoMedicalOutline /> Patients
        </h1>
        <AllPatients />
      </div>
    </div>
  );
};

export default Patients;
