
import React from 'react';

interface ModalProps {
  title: string;
  message: string;
  onClose: () => void;
  type?: 'info' | 'error' | 'success';
}

const Modal: React.FC<ModalProps> = ({ title, message, onClose, type = 'info' }) => {
  const typeClasses = {
    info: {
      bg: 'bg-blue-600',
      text: 'text-blue-100',
      border: 'border-blue-500',
    },
    error: {
      bg: 'bg-red-600',
      text: 'text-red-100',
      border: 'border-red-500',
    },
    success: {
      bg: 'bg-green-600',
      text: 'text-green-100',
      border: 'border-green-500',
    },
  };

  const currentTypeStyle = typeClasses[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className={`bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border-t-4 ${currentTypeStyle.border}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-semibold ${currentTypeStyle.text}`}>{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-2xl">&times;</button>
        </div>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="text-right">
          <button
            onClick={onClose}
            className={`${currentTypeStyle.bg} hover:opacity-80 text-white font-semibold py-2 px-4 rounded-lg transition duration-150`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
