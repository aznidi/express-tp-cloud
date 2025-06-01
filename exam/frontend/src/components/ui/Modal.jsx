import React from 'react';
import ReactModal from 'react-modal';
import { X } from 'lucide-react';
import { Button } from './Button';

// Set the app element for accessibility
if (typeof window !== 'undefined') {
  ReactModal.setAppElement('#root');
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`bg-surface border border-border rounded-lg shadow-card p-0 mx-4 my-8 max-h-[90vh] overflow-auto ${sizes[size]} w-full`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      closeTimeoutMS={200}
    >
      <div className="flex items-center justify-between p-md border-b border-border">
        <h2 className="text-xl font-semibold text-textPrimary font-poppins">
          {title}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-md">
        {children}
      </div>
    </ReactModal>
  );
}; 