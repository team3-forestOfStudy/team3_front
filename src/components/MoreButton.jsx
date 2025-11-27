import '../styles/morebutton.css';

export default function MoreButton({ children, buttonClass, onClick }) {
  return (
    <>
      <button className={`MoreButton ${buttonClass}`} onClick={onClick}>
        <p className="MoreButton_text">{children}</p>
      </button>
    </>
  );
}
