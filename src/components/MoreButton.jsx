import "../styles/morebutton.css";

export default function MoreButton({ children, buttonClass, onClick }) {
  return (
    <>
      <button
        className={`MoreButton ${buttonClass} u-hover-style-01 u-active-press`}
        onClick={onClick}
      >
        <p className="MoreButton_text">{children}</p>
      </button>
    </>
  );
}
