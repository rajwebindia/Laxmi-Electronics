import React from 'react';

/**
 * PriorityStatus Component
 * Displays a priority status badge with proper base and text colors
 * 
 * @param {string} priority - Priority level: 'high', 'medium', 'low', 'info', 'brand'
 * @param {string} label - Text to display (defaults to priority level if not provided)
 * @param {string} className - Additional CSS classes
 */
const PriorityStatus = ({ 
  priority = 'info', 
  label = null, 
  className = '' 
}) => {
  // Capitalize first letter of priority for default label
  const defaultLabel = priority.charAt(0).toUpperCase() + priority.slice(1);
  const displayLabel = label || defaultLabel;

  return (
    <span 
      className={`priority-status ${priority} ${className}`}
      title={`Priority: ${displayLabel}`}
    >
      {displayLabel}
    </span>
  );
};

export default PriorityStatus;

