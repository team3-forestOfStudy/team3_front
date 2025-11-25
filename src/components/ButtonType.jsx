import "../styles/buttontype.css";

function ButtonType({ children, buttonClass, onClick }) {
  return (
    <>
      <button className={`Button01 ${buttonClass}`} onClick={onClick}>
        <p className="Button01_text">{children}</p>
      </button>
    </>
  );
}

export default ButtonType;
