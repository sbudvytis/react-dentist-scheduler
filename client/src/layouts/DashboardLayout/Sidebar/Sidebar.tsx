import React from "react";
import ListboxItems from "./Listbox/ListboxItems";

type Props = {
  className?: string;
  hasSchedule: boolean;
  isLoading: boolean;
  children?: React.ReactNode; // Make this optional
};

const Sidebar = ({
  className = "",
  hasSchedule,
  isLoading,
  children,
}: Props) => {
  return (
    <div className={`${className} hidden sm:block p-2 flex-col h-full`}>
      <div className="pt-4">
        {children ? (
          children // Render custom children if provided
        ) : (
          <ListboxItems hasSchedule={hasSchedule} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
