import { Input } from "@nextui-org/react";
import { IoSearchCircleOutline } from "react-icons/io5";

interface PatientSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="pb-6">
      <Input
        radius="lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search patients by typing their name or contact number"
        startContent={<IoSearchCircleOutline size={24} color="gray" />}
      />
    </div>
  );
};

export default PatientSearch;
