type Props = {
  className?: string;
  children?: React.ReactNode;
};

const Sidebar = ({ className = "", children }: Props) => {
  return (
    <div className={`${className} hidden md:block md:px-2 flex-col h-full`}>
      <div className="pt-3">{children}</div>
    </div>
  );
};

export default Sidebar;
