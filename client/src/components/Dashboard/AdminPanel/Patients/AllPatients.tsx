import { useState } from "react";
import type { Patient } from "@mono/server/src/shared/entities";
import usePatients from "@/hooks/usePatients";
import AppointmentModal from "./AppointmentModal";
import { Appointment } from "@/components/Dashboard/types";
import { Button, Pagination, Spinner, Tooltip } from "@nextui-org/react";
import { IoCalendarOutline } from "react-icons/io5";

const AllPatients = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const { patients, isLoading, totalPatients } = usePatients(
    currentPage,
    pageSize
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

  const renderCell = (patient: Patient, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <div>{patient.patientId}</div>;
      case "name":
        return (
          <div>
            {patient.firstName} {patient.lastName}
          </div>
        );
      case "contactNumber":
        return <div>{patient.contactNumber}</div>;

      case "appointments":
        return (
          <Tooltip content="Appointment History" placement="top">
            <Button
              color="default"
              variant="bordered"
              radius="sm"
              isIconOnly
              startContent={<IoCalendarOutline />}
              className="border-1 bg-white border-gray-200 shadow-md shadow-gray-100"
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
    { name: "ID", uid: "id" },
    { name: "Name", uid: "name" },
    { name: "Number", uid: "contactNumber" },
    { name: "Appointments", uid: "appointments" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-48">
        <Spinner color="default" />
      </div>
    );
  }

  return (
    <>
      <div className="hide-scrollbar overflow-auto text-sm rounded-lg border border-gray-200 min-h-96">
        <table className="min-w-full table-fixed">
          <thead className="text-xs bg-white sticky top-0 z-10">
            <tr className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gray-200">
              {columns.map((column) => (
                <th
                  key={column.uid}
                  className={`text-left py-2 px-4 font-semibold text-gray-500 ${
                    column.uid === "id"
                      ? "w-1/10"
                      : column.uid === "name"
                      ? "w-4/10"
                      : "w-1/4"
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
                <tr key={patient.patientId} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.uid}
                      className={`py-2 px-2 ${
                        column.uid === "id"
                          ? "w-1/10"
                          : column.uid === "name"
                          ? "w-4/10"
                          : "w-1/4"
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
                <td colSpan={columns.length} className="py-2 px-4 text-center">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <AppointmentModal
          appointments={selectedAppointments}
          isOpen={isModalOpen}
          onClose={closeModal}
          patientName={selectedPatientName}
        />
      </div>
      <div className="flex justify-center py-4">
        <Pagination
          total={Math.ceil(totalPatients / pageSize)}
          page={currentPage}
          onChange={(page) => setCurrentPage(page)}
          initialPage={1}
          variant="bordered"
          color="default"
        />
      </div>
    </>
  );
};

export default AllPatients;
