import React from "react";
import "./ComponentFilters.css"

const stockIcon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-dice-3-fill" viewBox="0 0 16 16">
    <path d="M3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3zm2.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M8 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
</svg>

const customIcon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-palette-fill" viewBox="0 0 16 16">
    <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
</svg>

export default class ComponentFilters extends React.Component {       
    handleClick = (type) => {
        console.log(type)
        if (this.props.componentTypeFilter === undefined) {
            this.props.filterByComponentTypeCallback(type)
        }
        else {
            this.props.removedFilteredComponentTypeCallback()
        }
    }
    render() {
        var typeCounts = {}
        this.props.components.forEach((component, index) => {
            if (this.props.componentTypeFilter !== undefined && this.props.componentTypeFilter !== component.type) {
                return;
            }
            if (this.props.filteredNameSubstring !== undefined && !component.name.startsWith(this.props.filteredNameSubstring)) {
                return
            }
            typeCounts[component.type] = typeCounts[component.type] === undefined ? 1 : typeCounts[component.type] + 1
        });

        const deletedLastOfFilteredComponent = this.props.componentTypeFilter !== undefined && typeCounts[this.props.componentTypeFilter] === undefined
        if (deletedLastOfFilteredComponent) {
            this.props.removedFilteredComponentTypeCallback()
            typeCounts[this.props.componentTypeFilter] = 0
        }
        var sortedTypes = []
        for (var type in typeCounts) {
            const isStock = type.startsWith("STOCK_")
            
            var name = type
            if (isStock) {
                name = name.replaceAll("STOCK_", "")
            }
            sortedTypes.push({ name: name, type: type, count: typeCounts[type], isStock: isStock})
        }
        sortedTypes = sortedTypes.sort((a, b) => {
            if (a.count > b.count) {
                return -1;
            }
            if (a.count < b.count) {
                return 1;
            }

            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        })
        var buttons = []
        for (var i in sortedTypes) {
            var sortedType = sortedTypes[i]
            const type = sortedType.type
            var button = <button 
                type="button" 
                key={sortedType.name} 
                className="btn btn-outline-secondary btn-sm component-filter-button"
                onClick={() => this.handleClick(type)}
            >
                {sortedType.isStock ? stockIcon : customIcon} {sortedType.count}x {sortedType.name} 
            </button>
            buttons.push(button)
        }
        return <div>
            {buttons}
        </div>
    }
}