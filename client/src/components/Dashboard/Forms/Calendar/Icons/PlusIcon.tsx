interface PlusIconProps {
  size?: number;
  height?: number;
  width?: number;
}

export const PlusIcon = ({ size, height, width, ...props }: PlusIconProps) => {
  const { ...otherProps } = props;

  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <path
        d="M6 12H18"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 18V6"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;
