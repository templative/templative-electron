import React, { useState } from 'react';
import './ContentToggle.css';

/**
 * ContentToggle component for displaying selectable options with icons
 * 
 * @param {Object} props
 * @param {Array} props.options - Array of option objects with name, color, and icon properties
 * @param {Function} props.onChange - Callback function when selection changes
 * @param {string} props.defaultSelected - Name of the default selected option
 */
const ContentToggle = ({ options = [], onChange, defaultSelected, typeOfContent }) => {
  const [selected, setSelected] = useState(defaultSelected || (options[0]?.name || ''));

  const handleSelect = (optionName) => {
    setSelected(optionName);
    if (onChange) {
      onChange(optionName);
    }
  };
  return (
    <div className="content-toggle">
      {options.map((option) => {
        const isSelected = selected === option.name;
        return (
          <div
            key={option.name}
            className={`toggle-option ${isSelected ? 'active' : ''}`}
            onClick={() => handleSelect(option.name)}
        >
          <option.icon 
            className="toggle-icon" 
            style={{ color: isSelected ? option.color : 'var(--color-text-muted)'}} 
          />
          <span className={`toggle-label ${isSelected ? 'active' : ''}`}>
            {option.name} {typeOfContent || ""}
          </span>
        </div>
        );
      })}
    </div>
  );
};

export default ContentToggle;
