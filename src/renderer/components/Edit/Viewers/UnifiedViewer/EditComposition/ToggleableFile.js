import React, { useState } from 'react';
const ToggleableFile = ({ name, selectKey, color, Icon, handleSelect, selected, typeOfContent, selectable }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selected === selectKey;
  return (
    <div
      className={`toggle-option ${isSelected ? 'active' : ''} ${selectable ? 'selectable' : 'unselectable'}`}
      onClick={() => {if (selectable) handleSelect(selectKey)}}
      onMouseEnter={() => {if (selectable) setIsHovered(true)}}
      onMouseLeave={() => {if (selectable) setIsHovered(false)}}
  >
    <Icon 
      className={`toggle-icon`} 
      style={{ color: isSelected ? color : isHovered ? 'var(--color-text)' : 'var(--color-text-muted)'}} 
    />
    <span className={`toggle-label ${isSelected ? 'active' : ''}`}>
      {name} {typeOfContent || ""}
    </span>
  </div>
  );
};

export default ToggleableFile;
