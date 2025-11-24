export const Chip = ({ content, onClick }) => {
  return (
    <container className="chip bg_gray_50 g_sub_text09 fw_b" onClick={onClick}>
      {content}
    </container>
  )
}