// src/components/SortDropdown.jsx
import { useState, useEffect, useRef } from "react";
import ToggleIcon from "../assets/icons/ic_toggle.svg";
import "../styles/sortdropdown.css";

const OPTIONS = [
  { value: "recent", label: "최근 순" },
  { value: "oldest", label: "오래된 순" },
  { value: "points_desc", label: "많은 포인트 순" },
  { value: "points_asc", label: "적은 포인트 순" },
];

export default function SortDropdown({ value = "recent", onChange }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(
    OPTIONS.find(o => o.value === value) || OPTIONS[0],
  );

  // 드롭다운 바깥 클릭 감지용 ref
  const dropdownRef = useRef(null);

  // value prop이 바뀌면 현재 선택값 동기화
  useEffect(() => {
    const found = OPTIONS.find(o => o.value === value);
    if (found) setCurrent(found);
  }, [value]);

  // 바깥 영역 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = event => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = option => {
    setCurrent(option);
    onChange?.(option.value);
    setOpen(false);
  };

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="sort-dropdown__toggle"
        onClick={() => setOpen(o => !o)}
      >
        <span>{current.label}</span>
        <img
          src={ToggleIcon}
          alt=""
          className={`sort-dropdown__chevron ${open ? "is-open" : ""}`}
        />
      </button>

      {open && (
        <ul className="sort-dropdown__menu">
          {OPTIONS.map(opt => {
            const isActive = opt.value === current.value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  className={
                    "sort-dropdown__item" +
                    (isActive ? " sort-dropdown__item--active" : "")
                  }
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
