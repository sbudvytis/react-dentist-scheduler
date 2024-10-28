import ModalComponent from "@/layouts/DashboardLayout/Sidebar/Listbox/Modal";
import { Appointment } from "@/components/Dashboard/types";
import { Tooltip } from "@nextui-org/react";

interface AppointmentModalProps {
  appointments: Appointment[];
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointments,
  isOpen,
  onClose,
  patientName,
}) => {
  const columns = [
    { name: "Used email", uid: "email" },
    { name: "Title", uid: "title" },
    { name: "Start", uid: "start" },
    { name: "End", uid: "end" },
    { name: "Notes", uid: "notes" },
  ];

  const header: React.ReactNode = <h1>{patientName}'s Appointments</h1>;

  const renderAppointments = () => (
    <>
      <thead className="text-xs bg-white">
        <tr className="border-b border-gray-200">
          {columns.map((column) => (
            <th
              key={column.uid}
              className="text-left py-2 px-4 font-semibold text-gray-500"
            >
              {column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-gray-50">
              <td className="py-2 px-4">{appointment.email}</td>
              <td className="py-2 px-4">{appointment.title}</td>
              <td className="py-2 px-4">
                {new Date(appointment.start).toLocaleString()}
              </td>
              <td className="py-2 px-4">
                {new Date(appointment.end).toLocaleString()}
              </td>
              <td className="py-2 px-4">
                <Tooltip
                  content={appointment.notes}
                  radius="sm"
                  className="bg-black text-white"
                >
                  <span className="cursor-pointer">
                    {appointment.notes && appointment.notes.length >= 10
                      ? `${appointment.notes.slice(0, 10)}...`
                      : appointment.notes}
                  </span>
                </Tooltip>
              </td>
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
    </>
  );

  const content = (
    <div className="py-4">
      <div className="space-y-4">
        <div className="overflow-hidden text-sm rounded-2xl border border-gray-200 ">
          <div className="overflow-x-auto overflow-y-auto min-h-96 max-h-96">
            <table className="min-w-full">{renderAppointments()}</table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      header={header}
      size="5xl"
      scrollBehavior="normal"
    />
  );
};

export default AppointmentModal;
