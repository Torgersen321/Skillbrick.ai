import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/utils'; // Adjust path as necessary

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, className }) => {
  if (!isOpen) return null;

  // Use a portal to render the modal outside the normal DOM hierarchy
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} // Close modal on overlay click
    >
      <div
        className={cn(
          "relative w-full max-w-lg rounded-lg bg-background p-6 shadow-xl",
          "border border-border", // Added border for visibility
          className
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
      >
        {/* Optional Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-sm p-1 text-muted-foreground opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
             <path d="M18 6 6 18"/>
             <path d="m6 6 12 12"/>
          </svg>
          <span className="sr-only">Close</span>
        </button>

        {/* Modal Header */}
        {title && (
          <div className="mb-4 text-lg font-semibold">
            {title}
          </div>
        )}

        {/* Modal Content */}
        <div className="modal-content">
          {children}
        </div>

        {/* Optional Footer could go here */}
      </div>
    </div>,
    document.body // Mount the modal directly to the body
  );
};

export default Modal; 