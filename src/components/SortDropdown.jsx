// src/components/SortDropdown.jsx
import { useState, useEffect } from 'react';
import '../styles/sortdropdown.css';

const OPTIONS = [
  { value: 'recent', label: '최근 순' },
  { value: 'oldest', label: '오래된 순' },
  { value: 'points_desc', label: '많은 포인트 순' },
  { value: 'points_asc', label: '적은 포인트 순' },
];

export default function SortDropdown({ value = 'recent', onChange }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(
    OPTIONS.find(o => o.value === value) || OPTIONS[0],
  );

  useEffect(() => {
    const found = OPTIONS.find(o => o.value === value);
    if (found) setCurrent(found);
  }, [value]);

  const handleSelect = option => {
    setCurrent(option);
    onChange?.(option.value);
    setOpen(false);
  };

  return (
    <div className="sort-dropdown">
      <button
        type="button"
        className="sort-dropdown__toggle"
        onClick={() => setOpen(o => !o)}
      >
        <span>{current.label}</span>
        <span className="sort-dropdown__chevron">▾</span>
      </button>

      {open && (
        <ul className="sort-dropdown__menu">
          {OPTIONS.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                className={
                  'sort-dropdown__item' +
                  (opt.value === current.value
                    ? ' sort-dropdown__item--active'
                    : '')
                }
                onClick={() => handleSelect(opt)}
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
