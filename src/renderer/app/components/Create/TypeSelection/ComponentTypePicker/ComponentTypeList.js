import React, { useMemo } from "react";
import {componentTypeHasAllFilteredTags, matchesSearch} from "../../TagFilter"
import ComponentTypeFolder from "./ComponentTypeFolder";
import ComponentType from "./ComponentType";
import StockComponentType from "./StockComponentType";
import noFileIcon from "../../../Edit/noFileIcon.svg";

const ComponentTypeList = ({ 
    componentTypeOptions,
    selectedTags,
    majorCategories,
    search,
    selectTypeCallback,
    selectedComponentType,
    isStock
}) => {   
    const { componentDivs, categoryToFilteredTypes } = useMemo(() => {
        const filteredDivs = Object.keys(componentTypeOptions)
            .filter((key) => {
                return componentTypeHasAllFilteredTags(selectedTags, componentTypeOptions[key]["Tags"], majorCategories)
            })
            .filter((key) => {
                return matchesSearch(search, key)
            })
            .sort()
            .map((key) => {
                const existingQuantity = 0;
                // Choose between StockComponentType or ComponentType based on isStock
                const ComponentToRender = isStock ? StockComponentType : ComponentType;
                
                return <ComponentToRender 
                    key={`${key}${search}`} 
                    name={key} 
                    componentInfo={componentTypeOptions[key]}
                    selectTypeCallback={selectTypeCallback}
                    selectedComponentType={selectedComponentType} 
                    existingQuantity={existingQuantity}
                    search={search}    
                />
            });

        const categoryTypes = {};
        majorCategories.forEach(category => {
            const filteredComponentTypes = Object.keys(componentTypeOptions)
                .filter((key) => {                
                    const isMatchingTags = componentTypeHasAllFilteredTags(selectedTags, componentTypeOptions[key]["Tags"]);
                    const isMatchingCategory = componentTypeHasAllFilteredTags([category], componentTypeOptions[key]["Tags"]);
                    const isMatchingSearch = matchesSearch(search, key);
                    return isMatchingTags && isMatchingCategory && isMatchingSearch;
                })
                .sort();
            if (filteredComponentTypes.length > 0) {
                categoryTypes[category] = filteredComponentTypes;
            }
        });

        return {
            componentDivs: filteredDivs,
            categoryToFilteredTypes: categoryTypes
        };
    }, [componentTypeOptions, selectedTags, majorCategories, search, selectTypeCallback, selectedComponentType]);

    const folders = useMemo(() => {
        return Object.entries(categoryToFilteredTypes).map(([category, filteredComponentTypes]) => {
            return <ComponentTypeFolder 
                key={category} 
                search={search} 
                selectTypeCallback={selectTypeCallback} 
                category={category} 
                selectedTags={selectedTags} 
                componentTypeOptions={componentTypeOptions} 
                selectedComponentType={selectedComponentType} 
                filteredComponentTypes={filteredComponentTypes}
                isStock={isStock}
            />
        });
    }, [categoryToFilteredTypes, search, selectTypeCallback, selectedTags, componentTypeOptions, selectedComponentType, isStock]);

    const isSearchTooNarrow = 
        folders.length === 0 && 
        componentDivs.length === 0 && 
        Object.keys(componentTypeOptions).length > 0 && 
        search.trim() !== "";

    return (
        <div className="component-type-list">
            {isSearchTooNarrow && <p className="no-results-message">Your search returned no results.</p>}
            {folders}
            {/* {folders.length !== 0 && <p>Other {folders.length}</p>}  */}
            {componentDivs}
            {(folders.length !== 0 || componentDivs.length !== 0) && 
                <div className="end-of-component-types-icon-container">
                    <img src={noFileIcon} className="end-of-component-types-icon"/>
                </div>
            }
        </div>
    );
};

export default React.memo(ComponentTypeList);