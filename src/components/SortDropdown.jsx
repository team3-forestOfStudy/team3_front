import { useState } from "react";
import "../styles/dropdown.css";

const SORT_OPTIONS = [
  { id: "recent", label: "최근 순" },
  { id: "oldest", label: "오래된 순" },
  { id: "pointDesc", label: "많은 포인트 순" },
  { id: "pointAsc", label: "적은 포인트 순" },
];

export default function SortDropdown({ selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption =
    SORT_OPTIONS.find((opt) => opt.id === selected) || SORT_OPTIONS[0];

  const handleSelect = (id) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className="sort-dropdown">
      <button
        type="button"
        className="sort-dropdown__toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{selectedOption.label}</span>
        <span className="sort-dropdown__chevron">▾</span>
      </button>

      {isOpen && (
        <ul className="sort-dropdown__menu">
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                className={`sort-dropdown__item ${
                  opt.id === selected ? "sort-dropdown__item--active" : ""
                }`}
                onClick={() => handleSelect(opt.id)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
