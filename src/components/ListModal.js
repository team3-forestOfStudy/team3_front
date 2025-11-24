import Modal from "./Atoms/Modal";
import { Chip } from "./Atoms/Chip";
import { useState } from "react";
import "../styles/ListModal.css"

export default function ListModal() {
  const [open, setOpen] = useState("false");

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        리스트 모달 열기
      </button>

      <Modal className="listBox" isOpen={open} onClose={() => setOpen(false)}>
        <h1 className="g_sub_text02 fw_eb">습관 목록</h1>


        <Chip className="list" type="chip" ></Chip>

        <div className="buttonBox">
        <button className="okayButton Button01 w50 bg_gray_300" onClick={() => setOpen(false)}>취소</button>
        <button className="cancelButton Button01 w50" onClick={() => setOpen(false)}>수정 완료</button>
        </div>
      </Modal>
    </>
  );
}
