import React from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-main-bg rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 end-2.5 secondary-text bg-transparent hover:bg-gray-200 hover:secondary-text rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            <svg className="mx-auto mb-4 secondary-text w-12 h-12 dark:secondary-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <h3 className="mb-5 text-lg font-normal secondary-text dark:secondary-text">{title}</h3>
            <button
              onClick={onConfirm}
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
            >
              Yes, I'm sure
            </button>
            <button
              onClick={onClose}
              type="button"
              className="secondary-text bg-main-bg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:secondary-text focus:z-10 dark:bg-gray-700 dark:secondary-text dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 
