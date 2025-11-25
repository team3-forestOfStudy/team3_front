// src/components/LabelInput.js
import { useState } from "react";

export default function LabelInput({
  label,
  placeholder,
  type = "text", // "text" | "password" ...
  as = "input", // "input" | "textarea"
  value,
  onChange,
  errorType, // "", "empty", "invalid", "noNumber", "noSpecial", "notMatch"
}) {
  const [visible, setVisible] = useState(false);

  const errorMessage = {
    empty: "* 필수 입력사항입니다.",
    invalid: "잘못된 입력입니다.",
    noNumber: "최소 1개의 숫자가 포함되어야 합니다.",
    noSpecial: "최소 1개의 특수 문자가 포함되어야 합니다.",
    notMatch: "비밀번호가 일치하지 않습니다.",
  }[errorType];

  const isPassword = type === "password";

  return (
    <div className="input-group">
      {label && <h3 className="g_sub_tit">{label}</h3>}

      <div
        className={`input-wrapper ${
          isPassword ? "input-wrapper--password" : ""
        }`}
      >
        {as === "textarea" ? (
          <textarea
            className={`input-basic ${errorType ? "input-basic--error" : ""}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        ) : (
          <input
            type={isPassword && !visible ? "password" : "text"}
            className={`input-basic ${errorType ? "input-basic--error" : ""}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        )}

        {isPassword && (
          <button
            type="button"
            className="eye-btn"
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? "👁‍🗨" : "👁"}
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="red_800 g_sub_text13 mt5">{errorMessage}</p>
      )}
    </div>
  );
}
