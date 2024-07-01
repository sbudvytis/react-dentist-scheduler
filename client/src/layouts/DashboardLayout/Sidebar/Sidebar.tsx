import ListboxItems from "./Listbox/ListboxItems";
import LoggedInUser from "./User/LoggedInUser";

type Props = {
  className?: string;
  hasSchedule: boolean;
  isLoading: boolean;
};

const Sidebar = ({ className = "", hasSchedule, isLoading }: Props) => {
  return (
    <div className={`${className} p-2 flex flex-col h-full`}>
      <LoggedInUser />
      <ListboxItems hasSchedule={hasSchedule} isLoading={isLoading} />
    </div>
  );
};

export default Sidebar;
