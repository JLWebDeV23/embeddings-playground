// Modal.js
import React from 'react';

interface ModalProps {
    id: string;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

const Modal:React.FC<ModalProps> = ({ id, title, children, onClose }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
