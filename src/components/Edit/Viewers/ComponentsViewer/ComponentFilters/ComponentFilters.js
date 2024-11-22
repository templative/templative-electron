import React from "react";
import "./ComponentFilters.css"
const addSpaces = (str) => {
    return str
        // First specifically handle D4, D6, D8, D10, D12, D20
        .replace(/D(4|6|8|10|12|20)(\d+)/g, 'D$1 $2')
        // Then handle measurement units, keeping them with their numbers
        .replace(/(\d+)(mm|cm)/g, '$1$2')
        // Add space between lowercase and uppercase
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Add space between letters and numbers (except for measurement units)
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        // Clean up any double spaces
        .replace(/\s+/g, ' ')
        // Fix dice notation
        .replace(/D ?(4|6|8|10|12|20)/g, 'D$1')
        .trim()
}
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
            if (sortedType.count === 1) {
                continue;
            }
            var option = <p key={sortedType.name} 
                className={`component-header ${sortedType.type === this.props.componentTypeFilter && "selected-component-header"}`} 
                onClick={() => this.handleClick(type)}
            >
                {sortedType.count}x {addSpaces(sortedType.name)}
            </p>
            buttons.push(option)
        }
        return <div>
            {buttons}
        </div>
    }
}