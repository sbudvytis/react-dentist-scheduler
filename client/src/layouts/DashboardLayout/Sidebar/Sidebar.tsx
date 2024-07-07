import ListboxItems from "./Listbox/ListboxItems";
import LoggedInUser from "./User/LoggedInUser";

type Props = {
  className?: string;
  hasSchedule: boolean;
  isLoading: boolean;
};

const Sidebar = ({ className = "", hasSchedule, isLoading }: Props) => {
  return (
    <div className={`${className} hidden sm:block p-2 flex-col h-full`}>
      <LoggedInUser />
      <div className="pt-6">
        <ListboxItems hasSchedule={hasSchedule} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Sidebar;
