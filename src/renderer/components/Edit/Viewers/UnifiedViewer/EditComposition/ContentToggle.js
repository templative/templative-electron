import React, { useState } from 'react';
import './ContentToggle.css';
import ToggleableFile from './ToggleableFile';
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
        return <ToggleableFile key={option.name} {...option} Icon={option.icon} handleSelect={handleSelect} selected={selected} typeOfContent={typeOfContent} />
      })}
    </div>
  );
};

export default ContentToggle;
