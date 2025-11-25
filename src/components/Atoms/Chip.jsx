export const Chip = ({ children, onClick, className = "" }) => {
  return (
    <div
      className={`chip bg_gray_50 g_sub_text09 fw_b ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};