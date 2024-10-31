interface Props {
  className?: string;
  children?: React.ReactNode;
}

const Sidebar = ({ className = "", children }: Props) => {
  return (
    <div
      className={`${className} hidden md:block md:pl-2 md:pr-4 flex-col min-h-dvh`}
    >
      <div className="pt-3">{children}</div>
    </div>
  );
};

export default Sidebar;
