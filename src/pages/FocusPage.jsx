import { Router } from "react-router-dom";
import { Title } from "../mock/Title";

const FocusPage = () => {
  return (
    <>
      <div className="container">
        <div className="contents">
          <div className="g_box">
          <h3>{Title}</h3>
          </div>
        </div>
      </div>

    </>
  );
};

export default FocusPage;
