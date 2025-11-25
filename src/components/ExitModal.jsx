import { useState } from "react";
import Modal from "./Atoms/Modal";
import "../styles/ExitModal.css";

export default function ExitModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        나가기모달 열기
      </button>

      <Modal className="boxModal" isOpen={open} onClose={() => setOpen(false)}>
        <span className="okayMessage fw_l g_sub_text07">
          정말 나가시겠습니까?
        </span>
        <div className="buttonBox">
          <button
            className="okayButton Button01 w50 bg_gray_300"
            onClick={() => setOpen(false)}
          >
            취소
          </button>
          <button
            className="cancelButton Button01 w50"
            onClick={() => setOpen(false)}
          >
            확인
          </button>
        </div>
      </Modal>
    </>
  );
}
