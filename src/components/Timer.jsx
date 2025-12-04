import React, { useEffect, useRef, useState } from "react";
import "../styles/timer.css";
import StartIcon from "../assets/icons/starticon.svg";
import StopIcon from "../assets/icons/pause.svg";
import Stoptogglebtn from "../assets/icons/stoptogglebtn.svg";
import ResetIcon from "../assets/icons/reset.svg";
import Clock from "../assets/icons/clock.svg";
import { showSuccesToast, showStopToast, showTimeNotSetToast } from "../utils/toastmessage";


const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";

async function createFocusLog({ studyId, plannedMinutes, actualMinutes }) {
  if (studyId == null) {
    console.warn("studyId가 없습니다. API를 호출하지 않습니다.");
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/studies/${studyId}/focus-logs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plannedMinutes,
          actualMinutes,
        }),
      },
    );

    if (!response.ok) {
      console.error("포커스 로그 생성 실패:", response.status);
      return null;
    }

    const result = await response.json();
    return result?.data ?? null;
  } catch (error) {
    console.error("포커스 로그 API 호출 중 에러:", error);
    return null;
  }
}

const calcFocusPoint = minutes => {
  if (minutes <= 0) return 0;
  const bonus = Math.floor(minutes / 10);
  return 3 + bonus;
};

const Timer = ({ studyId, onPointEarned, initialMinutes = 0, onTimeSet }) => {
  const [durationMinutes, setDurationMinutes] = useState(initialMinutes);
  const [minutesInput, setMinutesInput] = useState(String(initialMinutes));

  const [remainingTime, setRemainingTime] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const intervalIdRef = useRef(null);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    if (!hasStarted) {
      setDurationMinutes(initialMinutes);
      setMinutesInput(String(initialMinutes));
      setRemainingTime(initialMinutes * 60);
    }
  }, [initialMinutes, hasStarted]);

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

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setRemainingTime(prev => {
          const next = prev - 1;
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
  }, [isRunning, durationMinutes, studyId]);

  const handleFirstStartClick = () => {
    if (durationMinutes > 0) {
      setRemainingTime(durationMinutes * 60);
      setHasStarted(true);
      setIsRunning(true);
      hasFinishedRef.current = false;
      if (onTimeSet) {
        onTimeSet(durationMinutes);
      }
    } else {
      // 시간이 설정되지 않았을 때 토스트 메시지 표시
      showTimeNotSetToast();
    }
  };


  const handleResumeStart = () => {
    if (remainingTime <= 0) return;
    setIsRunning(true);
  };

  const handleStop = async () => {
    setIsRunning(false);

    if (remainingTime >= 0) {
      showStopToast();
      return;
    }

    if (!hasStarted || configuredTotalSeconds <= 0) return;

    const elapsedSeconds = configuredTotalSeconds - remainingTime;
    const actualMinutes = Math.max(0, Math.floor(elapsedSeconds / 60));

    if (actualMinutes <= 0) {
      setHasStarted(false);
      setRemainingTime(0);
      hasFinishedRef.current = false;
      return;
    }

    const plannedMinutes = durationMinutes;

    try {
      const data = await createFocusLog({
        studyId,
        plannedMinutes,
        actualMinutes,
      });

      const pointFromServer =
        data && typeof data.pointAmount === "number" ? data.pointAmount : null;

      if (pointFromServer != null && pointFromServer > 0) {
        showSuccesToast(pointFromServer);
        if (onPointEarned) onPointEarned(pointFromServer);
      } else {
        const fallbackPoint = calcFocusPoint(actualMinutes);
        if (fallbackPoint > 0) {
          showSuccesToast(fallbackPoint);
          if (onPointEarned) onPointEarned(fallbackPoint);
        }
      }
    } catch (error) {
      console.error("포커스 로그/포인트 처리 중 에러:", error);
    } finally {
      setHasStarted(false);
      setRemainingTime(0);
      setDurationMinutes(0);
      setMinutesInput("0");
      hasFinishedRef.current = false;
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingTime(0);
    setMinutesInput("0");
    setDurationMinutes(0);
    setHasStarted(false);
    hasFinishedRef.current = false;
    if (onTimeSet) {
      onTimeSet(0);
    }
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
        isBelowZero ? (
          // ⬇초과 시간(remainingTime < 0)일 때
          <div className="button-wrap">
            <button
              type="button"
              onClick={handleStop}
              className="start-button bg_green_300 fw_eb white g_sub_text01"
            >
              <img
                src={Stoptogglebtn}
                alt="스톱 아이콘"
                className="start-button-icon"
              />
              Stop!
            </button>
          </div>
        ) : (
          // ⬇아직 0초 이상일 때
          <div className="start-controls">
            <button
              type="button"
              onClick={handleStop}
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
        )
      )}

    </div>
  );
};

export default Timer;
