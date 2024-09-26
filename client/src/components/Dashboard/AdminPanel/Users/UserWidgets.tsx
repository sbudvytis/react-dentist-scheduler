import { IoPeopleOutline } from "react-icons/io5";

const UserWidgets = () => {
  return (
    <div className="flex flex-col hide-scrollbar overflow-auto justify-start items-start text-sm rounded-lg border border-gray-200 min-h-28 max-h-28 p-4">
      {/* Heading outside the table */}
      <h1 className="text-sm text-left flex items-center gap-2 text-gray-600 font-bold">
        <IoPeopleOutline /> Users
      </h1>

      {/* Table with centered content */}
      <div className="flex flex-1 w-full justify-center items-center">
        <table className="min-w-full">
          <tbody className="flex justify-center items-center h-full">
            <tr>
              <td className="text-center">something</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserWidgets;
