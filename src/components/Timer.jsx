import React, { useEffect, useRef, useState } from "react";
import "../styles/timer.css";
import StartIcon from "../assets/icons/starticon.svg";

const Timer = () => {
  const [durationMinutes, setDurationMinutes] = useState(25); // 설정할 분
  const [remainingTime, setRemainingTime] = useState(25 * 60); // 남은 시간(초)
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // 한 번이라도 시작했는지
  const intervalIdRef = useRef(null);

  // durationMinutes가 바뀌면(타이머 시작 전) 남은 시간도 같이 변경
  useEffect(() => {
    if (!hasStarted) {
      setRemainingTime(durationMinutes * 60);
    }
  }, [durationMinutes, hasStarted]);

  // 타이머 동작
  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    if (remainingTime <= 0) {
      // 0초에서 다시 시작하면 현재 설정 분 기준으로 리셋
      setRemainingTime(durationMinutes * 60);
    }
    setHasStarted(true);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingTime(durationMinutes * 60);
    setHasStarted(false); // 다시 "기본 대기 상태"로
  };

  const handleDurationChange = e => {
    const value = Number(e.target.value);
    if (Number.isNaN(value)) return;

    // 최소 1분, 최대 180분 정도로 제한
    const clamped = Math.min(Math.max(value, 1), 180);
    setDurationMinutes(clamped);
  };

  const formatTime = () => {
    const minutes = String(Math.floor(remainingTime / 60)).padStart(2, "0");
    const seconds = String(remainingTime % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // 3분 이하일 때 빨간색
  const isDanger = remainingTime <= 3 * 60;

  // 처음 상태: 아직 한 번도 시작 안 했을 때
  const isInitial = !hasStarted;

  return (
    <div className="timer">
      {/* 가운데 큰 숫자 */}
      <div
        className={`timer-display g_sub_text20 fw_eb ${
          isDanger ? "timer-display-danger" : ""
        }`}
      >
        {formatTime()}
      </div>

      {/* 처음 상태: Start 버튼만 */}
      {isInitial && (
        <div className="button-wrap">
          <button
            type="button"
            onClick={handleStart}
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

      {/* 시작 후에는 Stop / Start / Reset 세 버튼 */}
      {!isInitial && (
        <div className="controls">
          <button
            type="button"
            onClick={handleStop}
            className="circle-btn stop-btn"
            aria-label="일시정지"
          >
            Stop!
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="start-button bg_green_300 fw_eb white g_sub_text01"
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
            className="circle-btn reset-btn"
            aria-label="리셋"
          >
            Reset!
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;
