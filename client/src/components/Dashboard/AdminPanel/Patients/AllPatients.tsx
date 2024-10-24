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
              radius="lg"
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
    { name: "Full Name", uid: "name" },
    { name: "Contact Number", uid: "contactNumber" },
    { name: "History", uid: "history" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-48">
        <Spinner color="default" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-200px)] relative">
      <PatientSearch
        searchTerm={searchTerm}
        setSearchTerm={handleSearchTermChange}
      />
      <div className="hide-scrollbar overflow-auto text-sm flex-grow">
        <div className="overflow-auto rounded-2xl border border-gray-200 relative min-h-32 max-h-full">
          <table className="min-w-full">
            <thead className="text-xs bg-white">
              <tr className="border-b border-gray-200">
                {columns.map((column) => (
                  <th
                    key={column.uid}
                    className={`text-left py-2 px-4 font-semibold text-gray-500 ${
                      column.uid === "name"
                        ? "w-[55%]"
                        : column.uid === "contactNumber"
                        ? "w-[35%]"
                        : "w-[10%]"
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
                    className="hover:bg-gray-100 even:bg-white odd:bg-gray-50"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.uid}
                        className={`py-2 px-2 ${
                          column.uid === "name"
                            ? "w-[55%]"
                            : column.uid === "contactNumber"
                            ? "w-[35%]"
                            : "w-[10%]"
                        }`}
                      >
                        <div className="px-2">
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
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AppointmentModal
          appointments={selectedAppointments}
          isOpen={isModalOpen}
          onClose={closeModal}
          patientName={selectedPatientName}
        />
      </div>
      <div className="flex lg:justify-start justify-center items-center gap-4 py-4 z-10">
        <span className="text-sm">
          Page {currentPage} of {Math.ceil(totalPatients / pageSize)}
        </span>
        <Pagination
          total={Math.ceil(totalPatients / pageSize)}
          page={currentPage}
          onChange={(page) => setCurrentPage(page)}
          initialPage={1}
          variant="bordered"
          color="default"
          showControls
        />
      </div>
    </div>
  );
};

export default AllPatients;
