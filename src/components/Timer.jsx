import React, { useEffect, useRef, useState } from "react";
import "../styles/timer.css";
import StartIcon from "../assets/icons/starticon.svg";
import StopIcon from "../assets/icons/pause.svg";
import Stoptogglebtn from "../assets/icons/stoptogglebtn.svg";
import ResetIcon from "../assets/icons/reset.svg";
import Clock from "../assets/icons/clock.svg";
import Modal from "../components/Atoms/Modal";
import { showSuccesToast, showStopToast } from "../utils/toastmessage";

// - 나중에 백엔드 배포가 끝나면 이 값을 실제 서버 주소로 교체하면 됨
const API_BASE_URL = "http://localhost:4000";

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

const Timer = ({ studyId, onPointEarned }) => {
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

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setRemainingTime(prev => {
          const next = prev - 1;
          // ⬇️ 시간 0초 도달 시 토스트 & 포인트 지급 로직 제거
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

  const handleStop = async () => {
    setIsRunning(false);

    // ⬇️ 0초 이상일 때는 "일시정지" 동작만 수행 (토스트만, 포인트 X)
    if (remainingTime >= 0) {
      showStopToast();
      return;
    }

    // ⬇️ 0초 아래(마이너스 구간)에서 Stop! 버튼을 누른 경우: 즉시 포인트 지급 + 대기 화면으로 전환
    if (!hasStarted || configuredTotalSeconds <= 0) return;

    const elapsedSeconds = configuredTotalSeconds - remainingTime;
    const actualMinutes = Math.max(0, Math.floor(elapsedSeconds / 60));

    if (actualMinutes <= 0) {
      // 방어 코드: 혹시라도 시간이 0분이면 그냥 대기 화면으로만 복귀
      setHasStarted(false);
      setRemainingTime(0);
      hasFinishedRef.current = false;
      return;
    }

    const plannedMinutes = durationMinutes;

    try {
      const data = await createFocusLog({
        // TODO: 실제 API 연결 시 studyId 프롭 사용
        studyId: studyId ?? 11,
        plannedMinutes,
        actualMinutes,
      });

      const pointFromServer =
        data && typeof data.pointAmount === "number" ? data.pointAmount : null;

      if (pointFromServer != null && pointFromServer > 0) {
        // ✅ 마이너스 구간에서는 "집중이 종료되었습니다" 토스트 없이 바로 포인트 토스트만 출력
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
      // ✅ 대기 화면으로 복귀 + 타이머 설정도 초기화
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

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <div className="timer-modal">
          <h3 className="timer-modal-title g_sub_text02 fw_eb">
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
              <span className="timer-modal-input">분</span>
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
