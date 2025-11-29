export const Chip = ({
  children,
  onClick,
  className = "",
  variant = "default",
}) => {
  const baseClass =
    variant === "default" ? "chip bg_gray_50 g_sub_text09 fw_b" : "";

  return (
    <div className={`${baseClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
