import './arrowbutton.css';
import ArrowRight from '../../assets/icons/arrow.svg';

export default function ArrowButton({ children }) {
  return (
    <button className="g_sub_text09 gray_600 detail_arrow_button">
      {children}
      <span>
        <img src={ArrowRight} alt="" />
      </span>
    </button>
  );
}
