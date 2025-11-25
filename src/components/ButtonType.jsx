import "../styles/ButtonType.css";

function ButtonType01({ children, buttonClass, onClick }) {
  return (
    <>
      <button className={`Button01 ${buttonClass}`} onClick={onClick}>
        <p className="Button01_text">{children}</p>
      </button>
    </>
  );
}

export default ButtonType01;