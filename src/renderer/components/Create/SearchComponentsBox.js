import React from 'react';
import TutorialQuestionMark from '../Tutorial/TutorialQuestionMark';
const SearchComponentsBox = ({ 
  isToggledToComponents, 
  toggleCustomOrStock, 
  componentTypeSearch, 
  setComponentTypeSearch,
  unit,
  setUnit
}) => {
  return (
    <div className="search-components-container">
       <div className="input-group input-group-sm search-components-box" data-bs-theme="dark">
        <span className="input-group-text soft-label">Search</span>
        <input 
          type="text" 
          className="form-control no-left-border" 
          placeholder={isToggledToComponents ? "deck / box / chit" : "red / tin / cube"} 
          value={componentTypeSearch} 
          onChange={(e) => setComponentTypeSearch(e.target.value)}
        />

        <span className="input-group-text soft-label">Size Unit</span>
        <div className="input-group-append">
          <select 
            className="form-select form-select-sm no-left-border" 
            style={{ borderRadius: '0 4px 4px 0' }}
            data-bs-theme="dark"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="px">px</option>
            <option value="in">inches</option>
            <option value="mm">mm</option>
            <option value="cm">cm</option>
          </select>
        </div>
        <TutorialQuestionMark tutorialName="Add Compositions" />
       </div>
      <div className="component-tabs">
        <button 
          className={`tab-button ${isToggledToComponents ? 'active' : ''}`} 
          onClick={() => !isToggledToComponents && toggleCustomOrStock()}
        >
          Custom Components
        </button>
        <button 
          className={`tab-button ${!isToggledToComponents ? 'active' : ''}`} 
          onClick={() => isToggledToComponents && toggleCustomOrStock()}
        >
          Stock Components
        </button>
      </div>
      
    </div>
  );
};

export default SearchComponentsBox; 