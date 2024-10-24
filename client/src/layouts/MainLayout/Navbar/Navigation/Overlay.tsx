interface Props {
  isMenuOpen: boolean;
  closeMenu: () => void;
}

const Overlay = ({ isMenuOpen, closeMenu }: Props) => {
  return (
    <div
      className={`fixed inset-0 bg-black z-20 transition-opacity duration-500 ${
        isMenuOpen ? "opacity-80" : "opacity-0 pointer-events-none"
      }`}
      onClick={closeMenu}
    ></div>
  );
};

export default Overlay;
