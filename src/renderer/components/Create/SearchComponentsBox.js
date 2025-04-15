import React from 'react';

const SearchComponentsBox = ({ 
  isToggledToComponents, 
  toggleCustomOrStock, 
  componentTypeSearch, 
  setComponentTypeSearch 
}) => {
  return (
    <div className="search-components-container">
       <div className="input-group input-group-sm search-components-box" data-bs-theme="dark">
        <input 
          type="text" 
          className="form-control" 
          placeholder={isToggledToComponents ? "Search Custom Component Types" : "Search Stock Components"} 
          value={componentTypeSearch} 
          onChange={(e) => setComponentTypeSearch(e.target.value)}
        />
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