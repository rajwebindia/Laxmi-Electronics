import { useEffect } from 'react';

const SuccessModal = ({ isOpen, onClose, message, title = "Thank You!" }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="success-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="success-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="success-modal-icon">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" className="success-circle"/>
            <path 
              d="M8 12l2 2 4-4" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="success-checkmark"
            />
          </svg>
        </div>
        <h3 className="success-modal-title">{title}</h3>
        <p className="success-modal-message">{message}</p>
        <button 
          className="success-modal-button"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

