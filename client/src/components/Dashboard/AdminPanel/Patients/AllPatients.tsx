import { useState } from "react";
import type { Patient } from "@mono/server/src/shared/entities";
import usePatients from "@/hooks/usePatients";
import AppointmentModal from "./AppointmentModal";
import { Appointment } from "@/components/Dashboard/types";
import { Button, Pagination, Spinner, Tooltip } from "@nextui-org/react";
import { IoCalendarOutline } from "react-icons/io5";
import PatientSearch from "./PatientSearch";

const AllPatients = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const { patients, isLoading, totalPatients } = usePatients(
    currentPage,
    pageSize,
    searchTerm
  );

  const [selectedAppointments, setSelectedAppointments] = useState<
    Appointment[]
  >([]);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (appointments: Appointment[], patientName: string) => {
    setSelectedAppointments(appointments);
    setSelectedPatientName(patientName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointments([]);
    setSelectedPatientName("");
  };

  const handleSearchTermChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const renderCell = (patient: Patient, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div>
            {patient.firstName} {patient.lastName}
          </div>
        );
      case "contactNumber":
        return <div>{patient.contactNumber}</div>;
      case "history":
        return (
          <Tooltip
            content="Appointment History"
            placement="top"
            radius="sm"
            className="bg-black text-white"
          >
            <Button
              color="default"
              variant="bordered"
              radius="sm"
              isIconOnly
              startContent={<IoCalendarOutline />}
              className="border-1 bg-white border-gray-200"
              onClick={() =>
                openModal(
                  patient.appointments,
                  `${patient.firstName} ${patient.lastName}`
                )
              }
            />
          </Tooltip>
        );
    }
  };

  const columns = [
    { name: "Name", uid: "name" },
    { name: "Number", uid: "contactNumber" },
    { name: "History", uid: "history" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-48">
        <Spinner color="default" />
      </div>
    );
  }

  // Calculate total pages
  const totalPages =
    totalPatients > 0 ? Math.ceil(totalPatients / pageSize) : 1;

  return (
    <div className="flex flex-col min-h-[calc(100dvh-195px)] relative ">
      <div className="text-sm flex-grow ">
        <div className="overflow-hidden rounded-xl bg-white border-1 p-4 relative">
          <div className="overflow-x-auto overflow-y-auto min-h-32 max-h-full">
            <div className="pb-6">
              <h1 className="text-lg text-left flex items-center text-slate-800 font-semibold">
                Patient list
              </h1>
              <h2 className="text-sm text-slate-400">
                Find patients and their appointment history
              </h2>
            </div>
            <PatientSearch
              searchTerm={searchTerm}
              setSearchTerm={handleSearchTermChange}
            />
            <table className="min-w-full">
              <thead className="text-xs bg-gray-50 rounded-t-lg rounded-b-lg">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.uid}
                      className={`text-left py-2 font-semibold text-gray-500 pr-2 ${
                        column.uid === "name"
                          ? "w-[55%]"
                          : column.uid === "contactNumber"
                          ? "w-[35%]"
                          : "w-[10%]"
                      } ${
                        index === 0
                          ? "rounded-tl-lg rounded-bl-lg pl-2"
                          : index === columns.length - 1
                          ? "rounded-tr-lg rounded-br-lg"
                          : ""
                      }`}
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr
                      key={patient.patientId}
                      className="border-b border-gray-100"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.uid}
                          className={`py-2 ${
                            column.uid === "name"
                              ? "w-[55%]"
                              : column.uid === "contactNumber"
                              ? "w-[35%]"
                              : "w-[10%]"
                          }`}
                        >
                          <div className="">
                            {renderCell(patient, column.uid)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-4 text-gray-500"
                    >
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AppointmentModal
          appointments={selectedAppointments}
          isOpen={isModalOpen}
          onClose={closeModal}
          patientName={selectedPatientName}
        />
      </div>
      <div className="flex lg:justify-start justify-center items-center gap-4 z-10">
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={(page) => setCurrentPage(page)}
          initialPage={1}
          isCompact={true}
          variant="light"
          color="default"
          size="md"
          radius="md"
          showControls
        />
      </div>
    </div>
  );
};

export default AllPatients;
