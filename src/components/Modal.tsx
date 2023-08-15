import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

export type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export default function Modal({ children, isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-body">{children}</div>
    </div>,
    document.getElementById("modal-container") as HTMLElement
  );
}
