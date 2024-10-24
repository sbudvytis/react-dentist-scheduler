interface Props {
  className?: string;
  children?: React.ReactNode;
}

const Sidebar = ({ className = "", children }: Props) => {
  return (
    <div className={`${className} hidden md:block md:px-2 flex-col min-h-dvh`}>
      <div className="pt-3">{children}</div>
    </div>
  );
};

export default Sidebar;
