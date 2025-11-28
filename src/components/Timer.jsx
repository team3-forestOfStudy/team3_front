import React, { useEffect, useRef, useState } from "react";
import "../styles/timer.css";
import StartIcon from "../assets/icons/starticon.svg";
import StopIcon from "../assets/icons/pause.svg";
import ResetIcon from "../assets/icons/reset.svg";
import Clock from "../assets/icons/clock.svg";
import Modal from "../components/Atoms/Modal";
import { showSuccesToast, showStopToast } from "../utils/toastmessage";

const Timer = () => {
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [minutesInput, setMinutesInput] = useState("0");

  const [remainingTime, setRemainingTime] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const intervalIdRef = useRef(null);
  const hasFinishedRef = useRef(false);

  const configuredTotalSeconds = durationMinutes * 60;

  const getTimeParts = sec => {
    const isNegative = sec < 0;
    const abs = Math.abs(sec);
    const m = String(Math.floor(abs / 60)).padStart(2, "0");
    const s = String(abs % 60).padStart(2, "0");
    return { isNegative, mm: m, ss: s };
  };

  const formatSeconds = sec => {
    const { mm, ss } = getTimeParts(sec);
    return `${mm}:${ss}`;
  };

  const calcFocusPoint = minutes => {
    if (minutes <= 0) return 0;
    const bonus = Math.floor(minutes / 10);
    return 3 + bonus;
  };

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setRemainingTime(prev => {
          const next = prev - 1;

          if (prev > 0 && next <= 0 && !hasFinishedRef.current) {
            hasFinishedRef.current = true;
            const point = calcFocusPoint(durationMinutes);
            if (point > 0) {
              showSuccesToast(point);
            }
          }

          return next;
        });
      }, 1000);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isRunning, durationMinutes]);

  const handleFirstStartClick = () => {
    setIsModalOpen(true);
  };

  const handleMinutesChange = e => {
    const raw = e.target.value;

    setMinutesInput(raw);

    if (raw === "") {
      setDurationMinutes(0);
      return;
    }

    let value = parseInt(raw, 10);
    if (Number.isNaN(value) || value < 0) value = 0;
    if (value > 60) value = 60;

    setDurationMinutes(value);
    setMinutesInput(String(value));
  };

  const handleModalConfirm = () => {
    const total = configuredTotalSeconds;

    if (total <= 0) return;

    setRemainingTime(total);
    setHasStarted(true);
    setIsRunning(true);
    hasFinishedRef.current = false;
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleResumeStart = () => {
    if (remainingTime <= 0) return;
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingTime(0);
    setMinutesInput("0");
    setDurationMinutes(0);
    setHasStarted(false);
    hasFinishedRef.current = false;
  };

  const isDanger = hasStarted && remainingTime <= 3 * 60;
  const isBelowZero = remainingTime < 0;
  const isInitial = !hasStarted;

  const { isNegative, mm, ss } = getTimeParts(remainingTime);

  return (
    <div className="timer">
      {configuredTotalSeconds > 0 && (
        <div className="timer-config">
          <div className="timer-chip">
            <img src={Clock} alt="clock" className="timer-clock-icon" />
            <span className="timer-config-text">
              {formatSeconds(configuredTotalSeconds)}
            </span>
          </div>
        </div>
      )}

      <div
        className={`timer-display g_sub_text20 fw_eb
           ${isDanger ? "gray_300" : ""}
           ${!isBelowZero && isDanger ? "red_600" : ""}
           ${!isBelowZero && !isDanger ? "" : ""}
           `}
      >
        {isNegative && <span className="timer-sign">-</span>}
        <span>{`${mm}:${ss}`}</span>
      </div>

      {isInitial && (
        <div className="button-wrap">
          <button
            type="button"
            onClick={handleFirstStartClick}
            className="start-button bg_green_300 fw_eb white g_sub_text01"
          >
            <img
              src={StartIcon}
              alt="시작 아이콘"
              className="start-button-icon"
            />
            Start!
          </button>
        </div>
      )}

      {!isInitial && (
        <div className="start-controls">
          <button
            type="button"
            onClick={() => {
              handleStop();
              showStopToast();
            }}
            className="circle-btn bg_green_700"
            aria-label="일시정지"
          >
            <img src={StopIcon} alt="정지 아이콘" className="stop-botton" />
          </button>

          <button
            type="button"
            onClick={handleResumeStart}
            className="start-button bg_gray_600 fw_eb white g_sub_text01"
          >
            <img
              src={StartIcon}
              alt="시작 아이콘"
              className="start-button-icon"
            />
            Start!
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="circle-btn bg_green_300"
            aria-label="리셋"
          >
            <img src={ResetIcon} alt="리셋 아이콘" className="reset-botton" />
          </button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <div className="timer-modal">
          <h3 className="timer-modal-title g_sub_text03 fw_eb">
            집중 시간 설정
          </h3>

          <div className="timer-modal-inputs">
            <div className="timer-modal-field g_sub_text03 fw_eb">
              <input
                type="number"
                min="0"
                max="60"
                value={minutesInput}
                onChange={handleMinutesChange}
                className="timer-modal-input"
              />
              <span>분</span>
            </div>
          </div>

          <div className="timer-modal-buttons">
            <button
              type="button"
              className="timer-modal-btn confirm bg_green_300 g_sub_text03 fw_eb white"
              onClick={handleModalConfirm}
            >
              확인
            </button>
            <button
              type="button"
              className="timer-modal-btn cancel bg_pink_100 g_sub_text03 fw_eb white"
              onClick={handleModalClose}
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Timer;
