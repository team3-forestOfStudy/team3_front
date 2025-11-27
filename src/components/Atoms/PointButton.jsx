import './pointButton.css';
import arrowRight from '../../assets/icons/ic_point.svg';

export default function PointButton({ children }) {
  return (
    <button className="g_sub_text09 detail_point_button">
      {children}
      <span>
        <img src={arrowRight} alt="" />
      </span>
    </button>
  );
}
